package no.dcat.themes.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class LOSStorage {
    static private final Logger logger = LoggerFactory.getLogger(LosRDFImporter.class);
    private static List<LosNode> allLosNodes;
    private static HashMap<String, LosNode> allLosNodesByURI;

    final String TABLE_EXISTS_QUERY = "SELECT EXISTS (SELECT 1 FROM information_schema.tables " +
        " WHERE table_schema = 'fdkreference'" +
        " AND table_name = 'lostema');";
    final String LOSTEMA_ALREADY_HARVESTED = "SELECT EXISTS (SELECT * from lostema)";

    final String INSERT_TERM_QUERY = "insert into lostema ( uri, tema ) values (?, ?)";
    final String INSERT_CHILD_QUERY = "insert into has_child(lostema_parent_id, lostema_child_id) values (?,?)";
    final String INSERT_PARENT_QUERY = "insert into has_parent(lostema_child_id, lostema_parent_id) values (?,?)";
    final String INSERT_SYNONYM = "insert into has_synonyms(temaid, synonym) values (?,?)";
    final String INSERT_DEFINITION = "insert into has_definition(temaid, lang, definition) values (?,?,?)";
    final String INSERT_NAME = "insert into has_name(temaid, lang, name) values (?,?,?)";
    final String INSERT_LOSPATH = "insert into has_lospaths(temaid, lospath) values (?,?)";

    final String SELECT_LOSNODE = "select id,uri,tema from lostema";
    final String SELECT_SYNONYMS = "select temaid,synonym from has_synonyms";
    final String SELECT_LOSPATHS = "select temaid, lospath from has_lospaths";
    final String SELECT_DEFINITIONS = "select temaid, lang, definition from has_definition";
    final String SELECT_NAMES = "select temaid, lang, name from has_name";
    final String SELECT_CHILDREN = "select lostema_parent_id,lostema_child_id from has_child";
    final String SELECT_PARENTS = "select lostema_child_id, lostema_parent_id from has_parent";


    @Autowired
    JdbcTemplate jdbcTemplate;

    public Boolean hasLosBeenPreviouslyHarvested() {
        Boolean losTemaHasBeenHarvested = false;
        Boolean dbHasCorrectSchemaAndTables = this.jdbcTemplate.queryForObject(TABLE_EXISTS_QUERY, Boolean.class);
        if (dbHasCorrectSchemaAndTables) {
            losTemaHasBeenHarvested = this.jdbcTemplate.queryForObject(LOSTEMA_ALREADY_HARVESTED, Boolean.class);
        }
        return losTemaHasBeenHarvested;
    }

    public void saveAllNodes(List<LosNode> allLosNodesIn, HashMap<String, LosNode> allLosNodesByURIIn) {
        allLosNodes = allLosNodesIn;
        allLosNodesByURI = allLosNodesByURIIn;

        HashMap<Long, LosNode> sqlIdToURI = new HashMap();
        HashMap<LosNode, Long> losNodeToSqlId = new HashMap<>();

        saveTema(sqlIdToURI, losNodeToSqlId);

        saveParents(losNodeToSqlId);

        saveChildren(losNodeToSqlId);

        saveNames(losNodeToSqlId);

        saveSynonyms(losNodeToSqlId);

        saveDefinitions(losNodeToSqlId);

        saveLosPaths(losNodeToSqlId);
    }

    private void saveTema(HashMap<Long, LosNode> sqlIdToURI, HashMap<LosNode, Long> losNodeToSqlId) {
        for (LosNode node : allLosNodes) {

            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(INSERT_TERM_QUERY,
                    java.sql.Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, node.getUri());
                ps.setBoolean(2, node.isTema);
                return ps;
            }, keyHolder);

            Long generatedId = ((Integer) keyHolder.getKeys().get("id")).longValue();
            sqlIdToURI.put(generatedId, node);
            losNodeToSqlId.put(node, generatedId);

        }
    }

    private void saveParents(HashMap<LosNode, Long> losNodeToSqlId) {
        class Parent_Row {
            Long parentId;
            Long childId;
        }

        List<Parent_Row> rowsOfParentsToSave = new ArrayList<>();

        for (LosNode node : allLosNodes) {
            if (node.getChildren() != null && !node.getChildren().isEmpty()) {

                Long parentId = losNodeToSqlId.get(node);

                for (URI child : node.getChildren()) {
                    Long childId = losNodeToSqlId.get(allLosNodesByURI.get(child.toString()));

                    Parent_Row row = new Parent_Row();
                    row.parentId = parentId;
                    row.childId = childId;
                    rowsOfParentsToSave.add(row);
                }
            }
        }

        jdbcTemplate.batchUpdate(INSERT_PARENT_QUERY, new BatchPreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Parent_Row row = rowsOfParentsToSave.get(i);
                ps.setLong(1, row.childId);
                ps.setLong(2, row.parentId);
            }

            @Override
            public int getBatchSize() {
                return rowsOfParentsToSave.size();
            }
        });
    }

    private void saveChildren(HashMap<LosNode, Long> losNodeToSqlId) {
        class Child_Row {
            Long parentId;
            Long childId;
        }

        List<Child_Row> rowsOfChildrenToSave = new ArrayList<>();

        for (LosNode node : allLosNodes) {
            if (node.getChildren() != null && !node.getChildren().isEmpty()) {

                Long parentId = losNodeToSqlId.get(node);

                for (URI child : node.getChildren()) {
                    Long childId = losNodeToSqlId.get(allLosNodesByURI.get(child.toString()));

                    Child_Row row = new Child_Row();
                    row.parentId = parentId;
                    row.childId = childId;
                    rowsOfChildrenToSave.add(row);
                }
            }
        }

        jdbcTemplate.batchUpdate(INSERT_CHILD_QUERY, new BatchPreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Child_Row row = rowsOfChildrenToSave.get(i);
                ps.setLong(1, row.parentId);
                ps.setLong(2, row.childId);
            }

            @Override
            public int getBatchSize() {
                return rowsOfChildrenToSave.size();
            }
        });
    }

    private void saveNames(HashMap<LosNode, Long> losNodeToSqlId) {
        class Name_Row {
            public Long nodeId;
            public String language;
            public String name;
        }

        List<Name_Row> rowsOfNameToSave = new ArrayList<>();

        for (LosNode node : allLosNodes) {
            if (node.getName() != null && !node.getName().isEmpty()) {
                Long nodeSqlId = losNodeToSqlId.get(node);
                for (String lang : node.getName().keySet()) {
                    String name = node.getName().get(lang);
                    Name_Row row = new Name_Row();
                    row.nodeId = nodeSqlId;
                    row.language = lang;
                    row.name = name;
                    rowsOfNameToSave.add(row);
                }
            }
        }

        jdbcTemplate.batchUpdate(INSERT_NAME, new BatchPreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Name_Row row = rowsOfNameToSave.get(i);
                ps.setLong(1, row.nodeId);
                ps.setString(2, row.language);
                ps.setString(3, row.name);
            }

            @Override
            public int getBatchSize() {
                return rowsOfNameToSave.size();
            }
        });
    }

    private void saveSynonyms(HashMap<LosNode, Long> losNodeToSqlId) {
        class Synonym_Row {
            public Long nodeId;
            public String synonym;
        }
        List<Synonym_Row> rowsOfSynonymsToSave = new ArrayList<>();

        for (LosNode node : allLosNodes) {
            if (node.getSynonyms() != null && !node.getSynonyms().isEmpty()) {

                Long nodeSqlId = losNodeToSqlId.get(node);

                for (String synonym : node.getSynonyms()) {
                    Synonym_Row row = new Synonym_Row();
                    row.nodeId = nodeSqlId;
                    row.synonym = synonym;
                    rowsOfSynonymsToSave.add(row);
                }
            }
        }

        jdbcTemplate.batchUpdate(INSERT_SYNONYM, new BatchPreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Synonym_Row row = rowsOfSynonymsToSave.get(i);
                ps.setLong(1, row.nodeId);
                ps.setString(2, row.synonym);
            }

            @Override
            public int getBatchSize() {
                return rowsOfSynonymsToSave.size();
            }
        });
    }

    private void saveDefinitions(HashMap<LosNode, Long> losNodeToSqlId) {
        class Definition_Row {
            public Long nodeId;
            public String language;
            public String definition;
        }

        List<Definition_Row> rowsOfDefinitionToSave = new ArrayList<>();

        for (LosNode node : allLosNodes) {
            if (node.getDefinition() != null && !node.getDefinition().isEmpty()) {
                Long nodeSqlId = losNodeToSqlId.get(node);
                for (String lang : node.getDefinition().keySet()) {
                    String definition = node.getDefinition().get(lang);
                    Definition_Row row = new Definition_Row();
                    row.nodeId = nodeSqlId;
                    row.language = lang;
                    row.definition = definition;
                    rowsOfDefinitionToSave.add(row);
                }
            }
        }

        jdbcTemplate.batchUpdate(INSERT_DEFINITION, new BatchPreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                Definition_Row row = rowsOfDefinitionToSave.get(i);
                ps.setLong(1, row.nodeId);
                ps.setString(2, row.language);
                ps.setString(3, row.definition);
            }

            @Override
            public int getBatchSize() {
                return rowsOfDefinitionToSave.size();
            }
        });
    }

    private void saveLosPaths(HashMap<LosNode, Long> losNodeToSqlId) {
        class LosPath_Row {
            public Long nodeId;
            public String losPath;
        }
        List<LosPath_Row> rowsOfLosPathsToSave = new ArrayList<>();

        for (LosNode node : allLosNodes) {
            if (node.getLosPaths() != null && !node.getLosPaths().isEmpty()) {

                Long nodeSqlId = losNodeToSqlId.get(node);
                for (String losPath : node.getLosPaths()) {
                    LosPath_Row row = new LosPath_Row();
                    row.nodeId = nodeSqlId;
                    row.losPath = losPath;
                    rowsOfLosPathsToSave.add(row);
                }
            }
        }

        jdbcTemplate.batchUpdate(INSERT_LOSPATH, new BatchPreparedStatementSetter() {

            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                LosPath_Row row = rowsOfLosPathsToSave.get(i);
                ps.setLong(1, row.nodeId);
                ps.setString(2, row.losPath);
            }

            @Override
            public int getBatchSize() {
                return rowsOfLosPathsToSave.size();
            }
        });
    }

    public void loadAllNodes(List<LosNode> allLosNodes, HashMap<String, LosNode> allLosNodesByURI) {

        //tema
        List<LosNode> nodes = jdbcTemplate.query(
            SELECT_LOSNODE,
            (rs, rowNum) -> {
                LosNode node = new LosNode();
                node.setInternalId(rs.getLong(1));
                node.setUri(rs.getString(2));
                allLosNodesByURI.put(node.getUri(), node);
                node.setTema(rs.getBoolean(3));
                node.setSynonyms(new ArrayList<>());
                node.setLosPaths(new ArrayList<>());
                node.setDefinition(new HashMap<>());
                node.setChildren(new ArrayList<>());
                node.setParents(new ArrayList<>());
                node.setName(new HashMap<>());
                return node;
            });

        HashMap<Long, LosNode> losNodeById = new HashMap<>();
        for (LosNode node : nodes) {
            losNodeById.put(node.getInternalId(), node);
        }

        //children
        jdbcTemplate.query(SELECT_CHILDREN,
            (ResultSetExtractor) rs -> {
                while (rs.next()) {
                    Long idChild = rs.getLong("lostema_child_id");
                    Long idParent = rs.getLong("lostema_parent_id");
                    LosNode node = losNodeById.get(idParent);
                    LosNode child = losNodeById.get(idChild);
                    try {
                        node.getChildren().add(new URI(child.getUri()));
                    } catch (URISyntaxException e) {
                    }
                }
                return null;
            });

        //parents
        jdbcTemplate.query(SELECT_PARENTS,
            (ResultSetExtractor) rs -> {
                while (rs.next()) {
                    Long idChild = rs.getLong("lostema_child_id");
                    Long idParent = rs.getLong("lostema_parent_id");
                    LosNode parent = losNodeById.get(idParent);
                    LosNode node = losNodeById.get(idChild);
                    try {
                        node.getParents().add(new URI(parent.getUri()));
                    } catch (URISyntaxException e) {
                    }
                }
                return null;
            });
        //names
        jdbcTemplate.query(SELECT_NAMES,
            (ResultSetExtractor) rs -> {
                while (rs.next()) {
                    Long id = rs.getLong("temaid");
                    String lang = rs.getString("lang");
                    String name = rs.getString("name");
                    LosNode node = losNodeById.get(id);
                    node.getName().put(lang, name);
                }
                return null;
            });


        //definition
        jdbcTemplate.query(SELECT_DEFINITIONS,
            (ResultSetExtractor) rs -> {
                while (rs.next()) {
                    Long id = rs.getLong("temaid");
                    String lang = rs.getString("lang");
                    String definition = rs.getString("definition");
                    LosNode node = losNodeById.get(id);
                    node.getDefinition().put(lang, definition);
                }
                return null;
            });

        //synonyms
        jdbcTemplate.query(SELECT_SYNONYMS,
            (ResultSetExtractor) rs -> {
                while (rs.next()) {
                    Long id = rs.getLong("temaid");
                    String synonym = rs.getString("synonym");
                    LosNode node = losNodeById.get(id);
                    node.getSynonyms().add(synonym);
                }
                return null;
            });

        //lospaths

        jdbcTemplate.query(SELECT_LOSPATHS,
            (ResultSetExtractor) rs -> {
                while (rs.next()) {
                    Long id = rs.getLong("temaid");
                    String lospath = rs.getString("lospath");
                    LosNode node = losNodeById.get(id);
                    node.getLosPaths().add(lospath);
                }
                return null;
            });

        allLosNodes.addAll(nodes);
    }
}
