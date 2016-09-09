package no.difi.dcat.api.synd;

import java.text.DateFormat;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.jdom2.Element;
import org.jdom2.Namespace;

import com.rometools.rome.feed.module.Module;
import com.rometools.rome.io.ModuleGenerator;

public class DcatModuleGenerator implements ModuleGenerator {

	private static final Namespace NAMESPACE = Namespace.getNamespace("datanorge", DcatModule.URI);
	private static final Set<Namespace> NAMESPACES;

	static {
		Set<Namespace> namespaces = new HashSet<Namespace>();
		namespaces.add(NAMESPACE);
		NAMESPACES = Collections.unmodifiableSet(namespaces);
	}

	@Override
	public String getNamespaceUri() {
		return DcatModule.URI;
	}

	@Override
	public Set<Namespace> getNamespaces() {
		return NAMESPACES;
	}

	DateFormat df = DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.MEDIUM);

	@Override
	public void generate(Module module, Element element) {
		DcatModule dcatModule = (DcatModule) module;
		if (dcatModule.getModified() != null) {
			Element el = new Element("modified", NAMESPACE);
			el.setText(df.format(dcatModule.getModified()));
			element.addContent(el);
		}
		if (dcatModule.getPublisher() != null) {
			Element el = new Element("publisher", NAMESPACE);
			el.setText(dcatModule.getPublisher());
			element.addContent(el);
		}
		if (dcatModule.getOrgNumber() != null) {
			Element el = new Element("orgnumber", NAMESPACE);
			el.setText(dcatModule.getOrgNumber());
			element.addContent(el);
		}
		if (dcatModule.getSubjects() != null) {
			for(String subject: dcatModule.getSubjects()) {
				Element el = new Element("subject", NAMESPACE);
				el.setText(subject);
				element.addContent(el);
				
			}
		}
		if (dcatModule.getKeywords() != null) {
			for (String keyword : dcatModule.getKeywords()) {
				Element el = new Element("keyword", NAMESPACE);
				el.setText(keyword);
				element.addContent(el);
			}
		}		
		if (dcatModule.getFormats() != null) {
			for (String format : dcatModule.getFormats()) {
				Element el = new Element("format", NAMESPACE);
				el.setText(format);
				element.addContent(el);
			}
		}
	}

}
