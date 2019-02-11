package no.dcat.controller;

import no.fdk.test.testcategories.UnitTest;
import org.junit.experimental.categories.Category;

//git @RunWith(MockitoJUnitRunner.class)
@Category(UnitTest.class)
public class LoginControllerTest {

//    @Mock
//    private CatalogController catalogController;
//
//    @Mock
//    private SpringSecurityContextBean springSecurityContextBean;
//
//    @InjectMocks
//    private LoginController loginController;

//    @Test
//    public void authenticateAndCreateMissingCatalogs_authWithoutOrgnr_noCatalogCreated() throws Exception {
//        when(springSecurityContextBean.getAuthentication()).thenReturn(mock(Authentication.class));
//        loginController.authenticateAndCreateMissingCatalogs();
//        verify(catalogController, times(0)).createCatalog(any());
//    }
//
//
//    @Test
//    public void authenticateAndCreateMissingCatalogs_authWithOrgnr_wrongRole_noCatalogCreated() throws Exception {
//        String orgnr = "ROLE_USER";
//        String username = "test";
//        Authentication authentication = mock(Authentication.class);
//        when(authentication.getUserName()).thenReturn(username);
//        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(orgnr);
//
//        List<GrantedAuthority> authorities = Arrays.asList(grantedAuthority);
//        Mockito.doReturn(authorities).when(authentication).getAuthorities();
//        when(springSecurityContextBean.getAuthentication()).thenReturn(authentication);
//
//        Catalog catalogId = new Catalog(orgnr);
//        HttpEntity<Catalog> response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
//
//        when(catalogController.createCatalog(catalogId)).thenReturn(new HttpEntity<>(catalogId));
//        when(catalogController.getCatalogId(orgnr)).thenReturn(response);
//
//        loginController.authenticateAndCreateMissingCatalogs();
//
//        verify(catalogController, times(0)).createCatalog(eq(catalogId));
//    }
//
//
//    @Test
//    public void authenticateAndCreateMissingCatalogs_authWithOrgnr_catalogDoesExists_catalogNotCreated() throws Exception {
//        String orgnr = "980123456";
//        String username = "test";
//        Authentication authentication = mock(Authentication.class);
//        when(authentication.getUserName()).thenReturn(username);
//        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(orgnr);
//
//        List<GrantedAuthority> authorities = Arrays.asList(grantedAuthority);
//        Mockito.doReturn(authorities).when(authentication).getAuthorities();
//        when(springSecurityContextBean.getAuthentication()).thenReturn(authentication);
//
//        Catalog catalogId = new Catalog(orgnr);
//        HttpEntity<Catalog> response = new ResponseEntity<>(HttpStatus.OK);
//
//        when(catalogController.createCatalog(catalogId)).thenReturn(new HttpEntity<>(catalogId));
//        when(catalogController.getCatalogId(orgnr)).thenReturn(response);
//
//        loginController.authenticateAndCreateMissingCatalogs();
//
//        verify(catalogController, times(0)).createCatalog(eq(catalogId));
//    }
//
//    @Test
//    public void authenticateAndCreateMissingCatalogs_authWithOrgnr_catalogDoesNotExist_catalogCreated() throws Exception {
//        String orgnr = "980123456";
//        String username = "test";
//        Authentication authentication = mock(Authentication.class);
//        when(authentication.getUserName()).thenReturn(username);
//        GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(orgnr);
//
//        List<GrantedAuthority> authorities = Arrays.asList(grantedAuthority);
//        Mockito.doReturn(authorities).when(authentication).getAuthorities();
//        when(springSecurityContextBean.getAuthentication()).thenReturn(authentication);
//
//        Catalog catalogId = new Catalog(orgnr);
//        HttpEntity<Catalog> response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
//
//        when(catalogController.createCatalog(catalogId)).thenReturn(new HttpEntity<>(catalogId));
//        when(catalogController.getCatalogId(orgnr)).thenReturn(response);
//
//        loginController.authenticateAndCreateMissingCatalogs();
//
//        verify(catalogController, times(1)).createCatalog(eq(catalogId));
//    }

}
