<?xml version="1.0" ?>
<xsl:stylesheet 
xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
xmlns:exsl="http://exslt.org/common" 
exclude-result-prefixes="exsl"
version="1.0" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" 
>
<xsl:key name="datasett" match="table:table[1]/table:table-row[1]/table:table-cell" use="."/>
  
    <xsl:output method="text" indent="yes"/>

    <xsl:template match="/">
        <xsl:text disable-output-escaping="yes">
        @prefix owl: &lt;http://www.w3.org/2002/07/owl#&gt; .
        @prefix rdfs: &lt;http://www.w3.org/2000/01/rdf-schema#&gt; .
        @prefix prefix_id: &lt;http://opendata.computas.no/data/tellus/&gt; .
        @prefix rdfs: &lt;http://www.w3.org/2000/01/rdf-schema#&gt; .
        @prefix tellus: &lt;http://opendata.computas.no/voc/tellus/&gt; .
        @prefix dct: &lt;http://purl.org/dc/terms/&gt; .
        @prefix geo: &lt;http://www.w3.org/2003/01/geo/wgs84_pos#&gt; .
        @prefix foaf: &lt;http://xmlns.com/foaf/0.1/&gt; .
        @prefix dbpedia-owl: &lt;http://dbpedia.org/ontology/&gt; .
        @prefix dbpedia-prop: &lt;http://dbpedia.org/property/&gt; .
        @prefix vcard: &lt;http://www.w3.org/2006/vcard/ns#&gt; .
        @prefix invanor: &lt;http://invanor.no/&gt; .
        @prefix t: &lt;http://www.w3.org/TR/owl-time#&gt; .
        @prefix gr: &lt;http://purl.org/goodrelations/v1#&gt; .
        @prefix xsd: &lt;http://www.w3.org/2001/XMLSchema#&gt; .
        @prefix skos: &lt;http://www.w3.org/2004/02/skos/core#&gt; .
        @prefix : &lt;http://data.brreg.no/vocab/temp/&gt; .
        @prefix dcat: &lt;http://www.w3.org/ns/dcat#&gt; .
        </xsl:text>

        <xsl:apply-templates select="//table:table[@table:name='Dataset']"/>
        <xsl:apply-templates select="//table:table[@table:name='Catalog']"/>
        <xsl:apply-templates select="//table:table[@table:name='Utgiver']"/>
        <xsl:apply-templates select="//table:table[@table:name='Kontakt']"/>
        <xsl:apply-templates select="//table:table[@table:name='Opphav']"/>
        <xsl:apply-templates select="//table:table[@table:name='Location']"/>
        <xsl:apply-templates select="//table:table[@table:name='Tilgangsrettighet']"/>
        <xsl:apply-templates select="//table:table[@table:name='Frequency']"/>
        <xsl:apply-templates select="//table:table[@table:name='Distribution']"/>
    </xsl:template>
    
    <xsl:template match="table:table[@table:name='Dataset']">
            
            <!-- manuell mapping til kolonner -->
            <xsl:variable name="identifikator" select="1"/>
            <xsl:variable name="tittel" select="2"/>
            <xsl:variable name="tittelEN" select="3"/> 
            <xsl:variable name="beskrivelse" select="4"/>    
            <xsl:variable name="beskrivelseEN" select="5"/>
            <xsl:variable name="utgiver" select="6"/>
            <xsl:variable name="tema" select="7"/>
            <xsl:variable name="provinens" select="8"/>
            <xsl:variable name="emneord" select="9"/>
            <xsl:variable name="begrep" select="10"/>
            <xsl:variable name="dekningsområde" select="11"/>
            <xsl:variable name="tilgangsnivå" select="12"/>
            <xsl:variable name="skjermingshjemmel" select="13"/>
            <xsl:variable name="frekvens" select="14"/>
            <xsl:variable name="kontaktpunkt" select="15"/>
            <xsl:variable name="iSamsvarMed" select="16"/>
            <xsl:variable name="dokumentasjon" select="17"/>
            <xsl:variable name="eksempeldata" select="18"/>
            <xsl:variable name="landingsside" select="19"/>
            <xsl:variable name="språk" select="20"/>
            <xsl:variable name="annenIdentifikator" select="21"/>
            <xsl:variable name="utgivelsesDato" select="22"/>
            <xsl:variable name="fra" select="23"/>
            <xsl:variable name="til" select="24"/>
            <xsl:variable name="modifisert" select="25"/>
            <xsl:variable name="distribusjon" select="26"/>

        <xsl:for-each select="table:table-row[position() &gt; 1][not(table:table-cell[$identifikator]='')]">
        
                <!-- create source uri -->
                <xsl:variable name="uri">http://data.brreg.no/dataset/<xsl:value-of select="normalize-space(table:table-cell[$utgiver])"/>/<xsl:value-of select="normalize-space(table:table-cell[$identifikator])"/></xsl:variable>
               
                <!-- type -->
                &lt;<xsl:value-of select="$uri"/>&gt;
                    a dcat:Dataset ;
                
                <!-- identifikator -->
                 <xsl:if test="normalize-space(table:table-cell[$identifikator])!=''">
                    :identifikator """<xsl:value-of select="normalize-space(table:table-cell[$identifikator])"/>""" ;
                </xsl:if>
                
                <!-- tittel -->
                <xsl:if test="normalize-space(table:table-cell[$tittel])!=''">
                    :tittel_no """<xsl:value-of select="normalize-space(table:table-cell[$tittel])"/>""" ;
                </xsl:if>
        
                <!-- tittel_en -->
                <xsl:if test="normalize-space(table:table-cell[$tittelEN])!=''">
                    :tittel_en """<xsl:value-of select="normalize-space(table:table-cell[$tittelEN])"/>""" ;
                </xsl:if>
                
                <!-- beskrivelse -->
                <xsl:if test="normalize-space(table:table-cell[$beskrivelse])!=''">
                    :beskrivelse_no """<xsl:value-of select="normalize-space(table:table-cell[$beskrivelse])"/>""" ;
                </xsl:if>
                
                <!-- beskrivelse en-->
                <xsl:if test="normalize-space(table:table-cell[$beskrivelseEN])!=''">
                    :beskrivelse_en """<xsl:value-of select="normalize-space(table:table-cell[$beskrivelseEN])"/>""" ;
                </xsl:if>

                <!-- utgiver -->
                <xsl:if test="normalize-space(table:table-cell[$utgiver])!=''">
                    :utgiver &lt;http://data.brreg.no/enhetsregisteret/enhet/<xsl:value-of select="normalize-space(table:table-cell[$utgiver])"/>&gt; ;
                </xsl:if>

                <!-- tema -->
                <xsl:if test="normalize-space(table:table-cell[$tema])!=''">
                    :tema &lt;http://publications.europa.eu/resource/authority/data-theme/<xsl:value-of select="normalize-space(table:table-cell[$tema])"/>&gt; ;
                </xsl:if>
                
                <!-- provinens -->
                <xsl:if test="normalize-space(table:table-cell[$provinens])!=''">
                    :provinens &lt;http://data.brreg.no/datakatalog/provenance/<xsl:value-of select="normalize-space(table:table-cell[$provinens])"/>&gt; ;
                </xsl:if>
                
                <!-- emneord -->
                <xsl:if test="normalize-space(table:table-cell[$emneord])!=''">
                    :keywords """<xsl:value-of select="normalize-space(table:table-cell[$emneord])"/>""" ;
                </xsl:if>
 
                <!-- begrep -->
                <xsl:if test="normalize-space(table:table-cell[$begrep])!=''">
                    :begrep """<xsl:value-of select="normalize-space(table:table-cell[$begrep])"/>""" ;
                </xsl:if>
 
                <!-- dekningsområde -->
                <xsl:if test="normalize-space(table:table-cell[$dekningsområde])!=''">
                    :dekningsområde """<xsl:value-of select="normalize-space(table:table-cell[$dekningsområde])"/>""" ;
                </xsl:if>
            
                <!-- tilgangsnivå -->
                <xsl:if test="normalize-space(table:table-cell[$tilgangsnivå])!=''">
                    :tilgangsnivå &lt;http://publications.europa.eu/resource/authority/access-right/<xsl:value-of select="normalize-space(table:table-cell[$tilgangsnivå])"/>&gt; ;
                </xsl:if>
                
                <!-- skjermingshjemmel -->
                <xsl:if test="normalize-space(table:table-cell[$skjermingshjemmel])!=''">
                    :skjermingshjemmel """<xsl:value-of select="normalize-space(table:table-cell[$skjermingshjemmel])"/>""" ;
                </xsl:if>
                
                <!-- frekvens -->
                <xsl:if test="normalize-space(table:table-cell[$frekvens])!=''">
                    :frekvens &lt;http://publications.europa.eu/resource/authority/frequency/<xsl:value-of select="normalize-space(table:table-cell[$frekvens])"/>&gt; ;
                </xsl:if>

                <!-- kontaktpunkt -->
                <xsl:if test="normalize-space(table:table-cell[$kontaktpunkt])!=''">
                    :kontaktpunkt &lt;http://data.brreg.no/datakatalog/kontaktpunkt/<xsl:value-of select="normalize-space(table:table-cell[$kontaktpunkt])"/>&gt; ;
                </xsl:if>

                <!-- i samsvar med -->
                <xsl:if test="normalize-space(table:table-cell[$iSamsvarMed])!=''">
                    :iSamsvarMed """<xsl:value-of select="normalize-space(table:table-cell[$iSamsvarMed])"/>""" ;
                </xsl:if>
                
                <!-- dokumentasjon -->
                <xsl:if test="normalize-space(table:table-cell[$dokumentasjon])!=''">
                    :iSamsvarMed """<xsl:value-of select="normalize-space(table:table-cell[$dokumentasjon])"/>""" ;
                </xsl:if>
                
                <!-- eksempeldata -->
                <xsl:if test="normalize-space(table:table-cell[$eksempeldata])!=''">
                    :eksempel """<xsl:value-of select="normalize-space(table:table-cell[$eksempeldata])"/>""" ;
                </xsl:if>

                <!-- landingsside -->
                <xsl:if test="normalize-space(table:table-cell[$landingsside])!=''">
                    :landingsside """<xsl:value-of select="normalize-space(table:table-cell[$landingsside])"/>""" ;
                </xsl:if>

                <!-- språk -->
                <xsl:if test="normalize-space(table:table-cell[$språk])!=''">
                    :språk &lt;http://publications.europa.eu/resource/authority/language/<xsl:value-of select="normalize-space(table:table-cell[$språk])"/>&gt; ;
                </xsl:if>

                <!-- annen identifikator -->
                <xsl:if test="normalize-space(table:table-cell[$annenIdentifikator])!=''">
                    :alternativIdentifikator &lt;http://data.brreg.no/datakatalog/identifikator/<xsl:value-of select="normalize-space(table:table-cell[$annenIdentifikator])"/>&gt; ;
                </xsl:if>
                
                <!-- utgivelsesdato -->
                <xsl:if test="normalize-space(table:table-cell[$utgivelsesDato])!=''">
                    :utgivelsesDato """<xsl:value-of select="normalize-space(table:table-cell[$utgivelsesDato])"/>""" ;
                </xsl:if>
                
                 <!-- fra -->
                <xsl:if test="normalize-space(table:table-cell[$fra])!=''">
                    :fra """<xsl:value-of select="normalize-space(table:table-cell[$fra])"/>""" ;
                </xsl:if>

                <!-- til -->
                <xsl:if test="normalize-space(table:table-cell[$til])!=''">
                    :til """<xsl:value-of select="normalize-space(table:table-cell[$til])"/>""" ;
                </xsl:if>
                
                 <!-- modifisert -->
                <xsl:if test="normalize-space(table:table-cell[$modifisert])!=''">
                    :modifisert """<xsl:value-of select="normalize-space(table:table-cell[$modifisert])"/>""" ;
                </xsl:if>             
                   
                 <!-- distribusjon -->
                <xsl:if test="normalize-space(table:table-cell[$distribusjon])!=''">
                    :distribusjon &lt;http://data.brreg.no/datakatalog/distibusjon/<xsl:value-of select="normalize-space(table:table-cell[$distribusjon])"/>&gt; ;
                </xsl:if>                
                .
                 
        </xsl:for-each>
        
    </xsl:template>
    
    
    
    <!-- CATALOG -->
    
    <xsl:template match="table:table[@table:name='Catalog']">
            
            <!-- manuell mapping til kolonner -->
            <xsl:variable name="id" select="1"/>
            <xsl:variable name="tittel" select="2"/>
            <xsl:variable name="beskrivelse" select="3"/>
            <xsl:variable name="utgiver" select="4"/>
            <xsl:variable name="datasets" select="5"/>
            <xsl:variable name="homepage" select="6"/>

            <xsl:for-each select="table:table-row[position() &gt; 1][not(table:table-cell[$id]='')]">
        
        
                <!-- create source uri -->
                <xsl:variable name="uri">http://data.brreg.no/datakatalog/katalog/<xsl:value-of select="normalize-space(table:table-cell[$utgiver])"/>/<xsl:value-of select="normalize-space(table:table-cell[$id])"/></xsl:variable>
               
                <!-- type -->
                &lt;<xsl:value-of select="$uri"/>&gt;
                    a dcat:Catalog ;

                <!-- tittel -->
                <xsl:if test="normalize-space(table:table-cell[$tittel])!=''">
                    :tittel """<xsl:value-of select="normalize-space(table:table-cell[$tittel])"/>""" ;
                </xsl:if>

                <!-- beskrivelse -->
                <xsl:if test="normalize-space(table:table-cell[$beskrivelse])!=''">
                    :beskrivelse """<xsl:value-of select="normalize-space(table:table-cell[$beskrivelse])"/>""" ;
                </xsl:if>
                
                 <!-- utgiver -->
                <xsl:if test="normalize-space(table:table-cell[$utgiver])!=''">
                    :utgiver &lt;http://data.brreg.no/enhetsregisteret/enhet/<xsl:value-of select="normalize-space(table:table-cell[$utgiver])"/>&gt; ;
                </xsl:if>

                <!-- datasett -->
                <xsl:if test="normalize-space(table:table-cell[$datasets])!=''">
                    :datasets """<xsl:value-of select="normalize-space(table:table-cell[$datasets])"/>""" ;
                </xsl:if>
                
                <!-- homepage -->
                <xsl:if test="normalize-space(table:table-cell[$homepage])!=''">
                    :homepage """<xsl:value-of select="normalize-space(table:table-cell[$homepage])"/>""" ;
                </xsl:if>
                .
                
            </xsl:for-each>
      
    </xsl:template>
    
    
    
    
    
    
    <!-- UTGIVER -->
    
    <xsl:template match="table:table[@table:name='Utgiver']">
            
            <!-- manuell mapping til kolonner -->
            <xsl:variable name="id" select="1"/>
            <xsl:variable name="organisasjonsnummer" select="1"/>
            <xsl:variable name="navn" select="2"/>

            <xsl:for-each select="table:table-row[position() &gt; 1][not(table:table-cell[$id]='')]">
        
        
                <!-- create source uri -->
                <xsl:variable name="uri">http://data.brreg.no/enhetsregisteret/enhet/<xsl:value-of select="normalize-space(table:table-cell[$id])"/></xsl:variable>
               
                <!-- type -->
                &lt;<xsl:value-of select="$uri"/>&gt;
                    a foaf:Agent ;

                <!-- orgnummer -->
                <xsl:if test="normalize-space(table:table-cell[$organisasjonsnummer])!=''">
                    :organisasjonsnummer """<xsl:value-of select="normalize-space(table:table-cell[$organisasjonsnummer])"/>""" ;
                </xsl:if>

                <!-- navn -->
                <xsl:if test="normalize-space(table:table-cell[$navn])!=''">
                    :navn """<xsl:value-of select="normalize-space(table:table-cell[$navn])"/>""" ;
                </xsl:if>
                .
                
            </xsl:for-each>
      
    </xsl:template>
    
    
    
    
    
     <xsl:template match="table:table[@table:name='Kontakt']">
            
            <!-- manuell mapping til kolonner -->
            <xsl:variable name="id" select="1"/>
            <xsl:variable name="avdelingsnavn" select="2"/>
            <xsl:variable name="hasEmail" select="3"/>
            <xsl:variable name="hasTelephone" select="4"/>
 

            <xsl:for-each select="table:table-row[position() &gt; 1][not(table:table-cell[$id]='')]">
        
        
                <!-- create source uri -->
                <xsl:variable name="uri">http://data.brreg.no/datakatalog/kontaktpunkt/<xsl:value-of select="normalize-space(table:table-cell[$id])"/></xsl:variable>
               
                <!-- type -->
                &lt;<xsl:value-of select="$uri"/>&gt;
                    a vcard:Organization ;

                <!-- avdelingsnavn -->
                <xsl:if test="normalize-space(table:table-cell[$avdelingsnavn])!=''">
                    :avdelingsnavn """<xsl:value-of select="normalize-space(table:table-cell[$avdelingsnavn])"/>""" ;
                </xsl:if>

                <!-- hasEmail -->
                <xsl:if test="normalize-space(table:table-cell[$hasEmail])!=''">
                    :hasEmail &lt;mailto:<xsl:value-of select="normalize-space(table:table-cell[$hasEmail])"/>&gt; ;
                </xsl:if>
                
                 <!-- hasTelephone -->
                <xsl:if test="normalize-space(table:table-cell[$hasTelephone])!=''">
                    :hasTelephone &lt;tel:<xsl:value-of select="normalize-space(table:table-cell[$hasTelephone])"/>&gt; ;
                </xsl:if>

                 .

            </xsl:for-each>
      
    </xsl:template>
    
    
    
         <xsl:template match="table:table[@table:name='Opphav']">
            
            <!-- manuell mapping til kolonner -->
            <xsl:variable name="id" select="1"/>
            <xsl:variable name="opphav" select="2"/>
            <xsl:variable name="tekst" select="3"/>

            <xsl:for-each select="table:table-row[position() &gt; 1][not(table:table-cell[$id]='')]">
        
                <!-- create source uri -->
                <xsl:variable name="uri">http://data.brreg.no/datakatalog/provenance/<xsl:value-of select="normalize-space(table:table-cell[$id])"/></xsl:variable>
               
                <!-- type -->
                &lt;<xsl:value-of select="$uri"/>&gt;
                    a dct:ProvenanceStatement  ;

                <!-- opphav -->
                <xsl:if test="normalize-space(table:table-cell[$opphav])!=''">
                    :generertAv """<xsl:value-of select="normalize-space(table:table-cell[$opphav])"/>""" ;
                </xsl:if>

                <!-- tekst -->
                <xsl:if test="normalize-space(table:table-cell[$tekst])!=''">
                    :opphavsKommentar """<xsl:value-of select="normalize-space(table:table-cell[$tekst])"/>""" ;
                </xsl:if>
               
                 .

            </xsl:for-each>
      
    </xsl:template>
    
    
       <xsl:template match="table:table[@table:name='Location']">
            
            <!-- manuell mapping til kolonner -->
            <xsl:variable name="uri_col" select="1"/>
            <xsl:variable name="label" select="2"/>
            <xsl:variable name="geo_navn_no" select="3"/>
            <xsl:variable name="geo_navn_en" select="4"/>


            <xsl:for-each select="table:table-row[position() &gt; 1][not(table:table-cell[$uri_col]='')]">
        
                <!-- create source uri -->
                <xsl:variable name="uri"><xsl:value-of select="normalize-space(table:table-cell[$uri_col])"/></xsl:variable>
               
                <!-- type -->
                &lt;<xsl:value-of select="$uri"/>&gt;
                    a dct:Location   ;

                <!-- uri -->
                <xsl:if test="normalize-space(table:table-cell[$label])!=''">
                    :geo_uri """<xsl:value-of select="normalize-space(table:table-cell[$uri_col])"/>""" ;
                </xsl:if>

                <!-- label -->
                <xsl:if test="normalize-space(table:table-cell[$label])!=''">
                    :geo_navn """<xsl:value-of select="normalize-space(table:table-cell[$label])"/>""" ;
                </xsl:if>

                <!-- geo_navn_no -->
                <xsl:if test="normalize-space(table:table-cell[$geo_navn_no])!=''">
                    :geo_navn_no """<xsl:value-of select="normalize-space(table:table-cell[$geo_navn_no])"/>""" ;
                </xsl:if>
                
                <!-- geo_navn_en -->
                <xsl:if test="normalize-space(table:table-cell[$geo_navn_en])!=''">
                    :geo_navn_en """<xsl:value-of select="normalize-space(table:table-cell[$geo_navn_en])"/>""" ;
                </xsl:if>

                 .

            </xsl:for-each>
      
    </xsl:template>

    
    
    <xsl:template match="table:table[@table:name='Tilgangsrettighet']">
            
            <!-- manuell mapping til kolonner -->
            <xsl:variable name="id" select="1"/>
            <xsl:variable name="navn_no" select="2"/>
            <xsl:variable name="navn_en" select="3"/>



            <xsl:for-each select="table:table-row[position() &gt; 1][not(table:table-cell[$id]='')]">
        
                <!-- create source uri -->
                <xsl:variable name="uri">http://publications.europa.eu/resource/authority/access-right/<xsl:value-of select="normalize-space(table:table-cell[$id])"/></xsl:variable>
               
                <!-- type -->
                &lt;<xsl:value-of select="$uri"/>&gt;
                    a dct:RightsStatement   ;

                <!-- navn_no -->
                <xsl:if test="normalize-space(table:table-cell[$navn_no])!=''">
                    :navn_no """<xsl:value-of select="normalize-space(table:table-cell[$navn_no])"/>""" ;
                </xsl:if>
                
                <!-- navn_en -->
                <xsl:if test="normalize-space(table:table-cell[$navn_en])!=''">
                    :navn_en """<xsl:value-of select="normalize-space(table:table-cell[$navn_en])"/>""" ;
                </xsl:if>

                 .

            </xsl:for-each>
      
    </xsl:template>
    
    
    
    
    <xsl:template match="table:table[@table:name='Frequency']">
            
            <!-- manuell mapping til kolonner -->
            <xsl:variable name="id" select="1"/>
            <xsl:variable name="navn_no" select="2"/>
            <xsl:variable name="navn_en" select="3"/>


            <xsl:for-each select="table:table-row[position() &gt; 1][not(table:table-cell[$id]='')]">
        
                <!-- create source uri -->
                <xsl:variable name="uri">http://publications.europa.eu/resource/authority/frequency/<xsl:value-of select="normalize-space(table:table-cell[$id])"/></xsl:variable>
               
                <!-- type -->
                &lt;<xsl:value-of select="$uri"/>&gt;
                    a dct:Frequency   ;

                <!-- navn_no -->
                <xsl:if test="normalize-space(table:table-cell[$navn_no])!=''">
                    :navn_no """<xsl:value-of select="normalize-space(table:table-cell[$navn_no])"/>""" ;
                </xsl:if>
                
                <!-- navn_en -->
                <xsl:if test="normalize-space(table:table-cell[$navn_en])!=''">
                    :navn_en """<xsl:value-of select="normalize-space(table:table-cell[$navn_en])"/>""" ;
                </xsl:if>

                 .

            </xsl:for-each>
      
    </xsl:template>




        <xsl:template match="table:table[@table:name='Distribution']">
            
            <!-- manuell mapping til kolonner -->
            <xsl:variable name="id" select="1"/>
            <xsl:variable name="beskrivelse" select="2"/>
            <xsl:variable name="format" select="3"/>
            <xsl:variable name="tilgangsURL" select="4"/>
            <xsl:variable name="lisens" select="5"/>

            <xsl:for-each select="table:table-row[position() &gt; 1][not(table:table-cell[$id]='')]">
        
                <!-- create source uri -->
                <xsl:variable name="uri">http://data.brreg.no/datakatalog/distibusjon/<xsl:value-of select="normalize-space(table:table-cell[$id])"/></xsl:variable>
               
                <!-- type -->
                &lt;<xsl:value-of select="$uri"/>&gt;
                    a :Distribution   ;

                <!-- id -->
                <xsl:if test="normalize-space(table:table-cell[$id])!=''">
                    :id """<xsl:value-of select="normalize-space(table:table-cell[$id])"/>""" ;
                </xsl:if>


                <!-- beskrivelse -->
                <xsl:if test="normalize-space(table:table-cell[$beskrivelse])!=''">
                    :beskrivelse """<xsl:value-of select="normalize-space(table:table-cell[$beskrivelse])"/>""" ;
                </xsl:if>
                
                <!-- format -->
                <xsl:if test="normalize-space(table:table-cell[$format])!=''">
                    :format """<xsl:value-of select="normalize-space(table:table-cell[$format])"/>""" ;
                </xsl:if>

                <!-- tilgangsURL -->
                <xsl:if test="normalize-space(table:table-cell[$tilgangsURL])!=''">
                    :tilgangsURL """<xsl:value-of select="normalize-space(table:table-cell[$tilgangsURL])"/>""" ;
                </xsl:if>
                
                  <!-- lisens -->
                <xsl:if test="normalize-space(table:table-cell[$lisens])!=''">
                    :lisens """<xsl:value-of select="normalize-space(table:table-cell[$lisens])"/>""" ;
                </xsl:if>
                
                 .

            </xsl:for-each>
      
    </xsl:template>
    
    
    
    
</xsl:stylesheet>