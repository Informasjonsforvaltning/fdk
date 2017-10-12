package no.dcat.authorization;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Service
@Profile("!prod")
public class AlwaysTrueAuthorizedOrgformService implements AuthorizedOrgformService {

    @Override
    public boolean isIncluded(Entity entry) {
        return true;
    }
}
