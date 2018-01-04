package no.dcat.harvester.crawler.notification;

import no.dcat.harvester.settings.ApplicationSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

/**
 * Created by bjg on 07.12.2017.
 */
@Component
public class EmailNotificationService {
    private final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);

    @Autowired
    private ApplicationSettings applicationSettings;

    @Autowired
    private JavaMailSender mailSender;


    public void sendValidationResultNotification(String toAddress, String subjectText, String messageText) {
        sendValidationResultNotification(
                applicationSettings.getNotificationMailSenderAddress(), toAddress, subjectText, messageText);
    }


    public void sendValidationResultNotification(String fromAddress, String toAddress, String subjectText, String messageText) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromAddress);
        message.setSubject(subjectText);
        message.setTo(toAddress);
        message.setText(messageText);

        try {
            this.mailSender.send(message);
        } catch (MailException mx) {
            logger.error(mx.getMessage());
        }

        logger.info("notification mail from address: {}", fromAddress);
        logger.info("notifiation mail sent to {} : {}", toAddress, messageText);
    }
}
