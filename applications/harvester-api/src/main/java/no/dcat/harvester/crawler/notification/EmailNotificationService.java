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
 * Helper class for sending validation emails.
 *
 */
@Component
public class EmailNotificationService {
    private final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);
    private JavaMailSender mailSender;

    @Autowired
    public EmailNotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendValidationResultNotification(String fromAddress, String toAddress, String subjectText, String messageText) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromAddress);
        message.setSubject(subjectText);
        message.setTo(toAddress);
        message.setText(messageText);

        logger.info("notification mail with size {} from address: {} to address: {}", messageText.length(), fromAddress, toAddress);
        logger.trace("notification mail contents {} :}", messageText);

        try {
            this.mailSender.send(message);
            logger.info("Send email success!");
        } catch (MailException mx) {
            logger.error("Send email failed: {}", mx.getMessage());
        }

    }
}
