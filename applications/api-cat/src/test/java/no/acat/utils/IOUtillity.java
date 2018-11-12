package no.acat.utils;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;
import java.io.IOException;

public class IOUtillity {

  public static String getStringOutputFromFile(String ClassPathResourceFileName) throws IOException {
    return IOUtils.toString(
        new ClassPathResource(ClassPathResourceFileName).getInputStream(), "UTF-8");
  }
}
