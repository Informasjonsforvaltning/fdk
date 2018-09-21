package no.dcat.harvester.settings;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties
@ConfigurationProperties(prefix="elastic")
public class ElasticSettings {
	
	private String clusterNodes;
	private String clusterName;

	public String getClusterNodes() {
		return clusterNodes;
	}

	public void setClusterNodes(String clusterNodes) {
		this.clusterNodes = clusterNodes;
	}

	public String getClusterName() { return clusterName; }

	public void setClusterName(String clusterName) {this.clusterName = clusterName; }
}
