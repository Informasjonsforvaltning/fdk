import {AccessRightsModel} from "./accessRightsModel";
import {Injectable} from "@angular/core";

@Injectable()
export class AccessRightsService {
  private hardcodedModel: AccessRightsModel[] = [{
    id: 1,
    label: 'Offentlig',
    uri: 'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
  },
    {
      id: 2,
      label: 'Begrenset offentlighet',
      uri: 'http://publications.europa.eu/resource/authority/access-right/RESTRICTED'
    },
    {
      id: 3,
      label: 'Unntatt offentlighet',
      uri: 'http://publications.europa.eu/resource/authority/access-right/NON_PUBLIC'
    }];

  getAll(): AccessRightsModel[] {
    return this.hardcodedModel;
  }

  get(uri: string): AccessRightsModel {
    return this.hardcodedModel.filter(model => model.uri == uri).pop();
  }

}
