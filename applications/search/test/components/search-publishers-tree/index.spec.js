import React from 'react';
import TreeView from 'react-treeview';
import PublisherTree from '../../../src/components/search-publishers-tree';

describe('PublisherTree', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PublisherTree />);
  });

  it ('should render', () => {
    expect(wrapper).to.have.length(1);
  });

  it ('should render publishers', () => {
    expect(wrapper.find('.tree-panel')).to.have.length(0);

    wrapper.setState({
      "source":
        {
          "hits": [{
            "name": "STAT",
            "orgPath": "/STAT",
            "children": [{
              "name": "ARBEIDS- OG SOSIALDEPARTEMENTET",
              "orgPath": "/STAT/983887457",
              "children": [{
                "name": "NAV",
                "orgPath": "/STAT/983887457/889640782",
                "children": []
              }]
            }, {
              "name": "FINANSDEPARTEMENTET",
              "orgPath": "/STAT/972417807",
              "children": [{
                "name": "SKATTEETATEN",
                "orgPath": "/STAT/972417807/974761076",
                "children": []
              }, {
                "name": "SSB",
                "orgPath": "/STAT/972417807/971526920",
                "children": []
              }]
            }, {
              "name": "HELSE- OG OMSORGSDEPARTEMENTET",
              "orgPath": "/STAT/983887406",
              "children": [{
                "name": "DIREKTORATET FOR E-HELSE",
                "orgPath": "/STAT/983887406/915933149",
                "children": []
              }, {
                "name": "HELSEDIREKTORATET",
                "orgPath": "/STAT/983887406/983544622",
                "children": []
              }]
            }]
          }, {
            "name": "KOMMUNE",
            "orgPath": "/KOMMUNE",
            "children": [{
              "name": "OSLO KOMMUNE",
              "orgPath": "/KOMMUNE/958935420",
              "children": [{
                "name": "OSLO KOMMUNE BYRÅDSAVDELING FOR BYUTVIKLING",
                "orgPath": "/KOMMUNE/958935420/974770482",
                "children": [{
                  "name": "OSLO KOMMUNE PLAN- OG BYGNINGSETATEN",
                  "orgPath": "/KOMMUNE/958935420/974770482/971040823",
                  "children": []
                }]
              }, {
                "name": "OSLO KOMMUNE BYRÅDSAVDELING FOR MILJØ OG SAMFERDSEL",
                "orgPath": "/KOMMUNE/958935420/974770474",
                "children": [{
                  "name": "OSLO KOMMUNE BYMILJØETATEN",
                  "orgPath": "/KOMMUNE/958935420/974770474/996922766",
                  "children": []
                }, {
                  "name": "OSLO KOMMUNE RENOVASJONSETATEN",
                  "orgPath": "/KOMMUNE/958935420/974770474/976820088",
                  "children": []
                }]
              }]
            }]
          }]
        }

    });
    expect(wrapper.find('.tree-panel')).to.have.length(2);
    expect(wrapper.find(TreeView)).to.have.length(8);
  });

});
