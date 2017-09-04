package no.dcat.portal.webapp.domain;

import java.util.Date;

/**
 * Created by bjg on 11.11.2016.
 * Models dct:PeriodOfTime
 * https://doc.difi.no/dcat-ap-no/#_tidsperiode
 * An interval of time that is named or defined by its start and end dates.
 */
public class PeriodOfTime {
    private String id;
    private String name;
    private Date startDate;
    private Date endDate;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }


}
