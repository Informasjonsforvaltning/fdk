package no.dcat.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Maps all AngularJS routes to index so that they work with direct linking.
 * <p>
 * Created by dask on 30.05.2017.
 */
@Controller
public class AngularController {

    @CrossOrigin
    @RequestMapping(value = {
            "/",
            "/catalogs",
            "/catalogs/{catid}",
            "/catalogs/{catid}/datasets",
            "/catalogs/{catid}/datasets/{datid}"})
    public String index() {
        return "forward:/index.html";
    }

}
