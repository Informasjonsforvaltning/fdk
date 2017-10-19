package no.dcat.shared;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.ToString;

import java.util.Date;

/**
 * Created by bjg on 24.02.2017.
 * Models dct:PeriodOfTime
 * https://doc.difi.no/dcat-ap-no/#_tidsperiode
 * An interval of time that is named or defined by its start and end dates.
 */
@Data
@ToString(includeFieldNames = false)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PeriodOfTime {
    private String id;
    private String name;
    private Date startDate;
    private Date endDate;
}

