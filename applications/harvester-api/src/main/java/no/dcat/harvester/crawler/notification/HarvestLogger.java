package no.dcat.harvester.crawler.notification;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.encoder.PatternLayoutEncoder;
import ch.qos.logback.core.FileAppender;
import ch.qos.logback.classic.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.net.MalformedURLException;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

/**
 * Created by bjg on 15.01.2018.
 *
 * Helper class for collecting harvest log messages in temporary files
 */
public class HarvestLogger {
    LoggerContext logctx;
    FileAppender fileAppender = new FileAppender();
    PatternLayoutEncoder encoder = new PatternLayoutEncoder();
    Logger logger;


    public HarvestLogger() {
        setup("logfile.txt");
    }


    public HarvestLogger(String logfilename) {
        setup(logfilename);
    }


    public void setup(String logfilename) {
        this.logctx = (LoggerContext) LoggerFactory.getILoggerFactory();

        this.encoder.setContext(logctx);
        this.encoder.setPattern("%r %thread %level - %msg%n");
        this.encoder.start();

        this.fileAppender.setContext(logctx);
        this.fileAppender.setName("harvesterLogFileAppender-" + logfilename);
        this.fileAppender.setFile(logfilename);
        this.fileAppender.setEncoder(encoder);
        this.fileAppender.start();

        this.logger = logctx.getLogger("HarvesterLog");
        this.logger.addAppender(fileAppender);
    }


    public Logger getLogger() {
        return this.logger;
    }


    public String getLogContents() {
        Resource resource = null;
        try {
            resource = new UrlResource("file:" + this.fileAppender.getFile());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        String contents = "";
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));
            contents = reader.lines().collect(Collectors.joining("\n"));
        } catch (IOException e) {
            System.out.println(e);
        }
        return contents;
    }


    /**
     * Cleanup - deletes log file
     */
    public void closeLog() {
        File logfile = new File(this.fileAppender.getFile());
        this.fileAppender.stop();
        logfile.delete();
    }

}
