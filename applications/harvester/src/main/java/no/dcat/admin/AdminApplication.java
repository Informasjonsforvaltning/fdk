package no.dcat.admin;

import no.dcat.admin.error.AppErrorController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@SpringBootApplication
@EnableScheduling
public class AdminApplication  {

    @Bean
    public PasswordEncoder passwordEncoder() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder;
    }

    @Autowired
    private ErrorAttributes errorAttributes;

    @Bean
    public AppErrorController appErrorController() {

        return new AppErrorController(errorAttributes);
    }


    public static void main(String[] args) {

        SpringApplication.run(AdminApplication.class, args);
    }

}

