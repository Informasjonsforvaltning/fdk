package no.acat.utils;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import java.io.IOException;

public class IOUtillity {

  public static String getStringOutputFromFile(String classPathResourceFileName) throws IOException {
    return IOUtils.toString(
        new ClassPathResource(classPathResourceFileName).getInputStream(), "UTF-8");
  }
}
