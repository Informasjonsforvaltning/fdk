package no.difi.dcat.api.synd;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.view.feed.AbstractRssFeedView;

import com.rometools.rome.feed.rss.Channel;
import com.rometools.rome.feed.rss.Description;
import com.rometools.rome.feed.rss.Guid;
import com.rometools.rome.feed.rss.Item;

public class DcatRssView extends AbstractRssFeedView {
	
	public DcatRssView() {
	}
	
	@Override
	protected void buildFeedMetadata(Map<String, Object> model, Channel channel, 
			HttpServletRequest request) {
		channel.setTitle("DCAT Harvester");
		channel.setLink("http://demo.difi.no");
		channel.setDescription("DIFI DCAT Harvester Demo");
	}
	@Override
	protected List<Item> buildFeedItems(
			Map<String, Object> model, HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		List<Item> items = new ArrayList<>();
	
		Object ob = model.get("feeds");
		if (ob instanceof List){
	           for(int i = 0; i < ((List<?>)ob).size(); i++){
	                Object feedObj = ((List<?>) ob).get(i);
	                DcatFeed dcatFeed = (DcatFeed)feedObj;
	    		Item item = new Item();
	    		item.setTitle(dcatFeed.getTitle());
	    		item.setLink(dcatFeed.getLink());
	    		item.setPubDate(dcatFeed.getPubDate());
	    		Guid guid = new Guid();
	    		guid.setValue(dcatFeed.getGuid());
	    		item.setGuid(guid);
	    		Description description = new Description();
	    		description.setValue(dcatFeed.getDescription());
	    		item.setDescription(description);
				item.getModules().add(dcatFeed.getDcatModule());
	    		items.add(item);
	           }
		}
		return items;
	}
}
