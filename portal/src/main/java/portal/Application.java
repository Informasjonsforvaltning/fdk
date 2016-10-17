package portal;

        import java.net.InetAddress;
        import java.net.UnknownHostException;
        import java.util.Arrays;


        import org.elasticsearch.client.Client;
        import org.elasticsearch.client.transport.TransportClient;
        import org.elasticsearch.common.transport.InetSocketTransportAddress;
        import org.slf4j.Logger;
        import org.slf4j.LoggerFactory;
        import org.springframework.boot.SpringApplication;
        import org.springframework.boot.autoconfigure.SpringBootApplication;
        import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class Application {
    static Logger logger = LoggerFactory.getLogger(Application.class);

    public static void main(String[] args) {
        ApplicationContext ctx = SpringApplication.run(Application.class, args);

   /*     System.out.println("Let's inspect the beans provided by Spring Boot:");

        String[] beanNames = ctx.getBeanDefinitionNames();
        Arrays.sort(beanNames);
        for (String beanName : beanNames) {
            System.out.println(beanName);
        }*/
/*
        // connect to ES
        Client client = null;
        logger.info("Starting Portal Application");
        try {
            client = TransportClient.builder().build()
                    .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("es"),9300));
        } catch (UnknownHostException e) {
            // TODO Auto-generated catch block
            logger.error("ERROR: "+ e.getMessage());
        }

        logger.info("Client is connected " + client.toString());
*/
    }

}