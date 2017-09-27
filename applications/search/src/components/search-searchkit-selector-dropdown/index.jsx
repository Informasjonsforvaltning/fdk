import * as React from "react";

//import { ItemComponent, CheckboxItemComponent } from "./ItemComponents"
//import { ListProps } from "./ListProps"
//import { ListProps } from "../node_modules/searchkit/src/components/ui/list"
//import {PureRender} from "../../../core"
import {ItemComponent, CheckboxItemComponent, ListProps, PureRender} from 'searchkit';
let block = require("bem-cn")
import {map} from "lodash"
import {filter} from "lodash"
import {transform} from "lodash"
import {find} from "lodash"
import {identity} from "lodash"
import {DropdownButton, MenuItem} from 'react-bootstrap';

import localization from '../localization';


export class Select extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      selectedValue: `${localization.sort.by} ${localization.sort['by.relevance'].toLowerCase()}`,
      setItems: null
    }
    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    this.setState({
      setItems: this.props.setItems
    });
  }

  onChange(e){
    //const { setItems } = this.props
    const key = e.key;
    console.log("dropdown key: " + key);
    this.state.setItems([key]);
    let text = this.props.translate(e.label || e.title || e.key)
    this.setState({
      selectedValue: `${text}`
    })
  }

  getSelectedValue(){
    const { selectedItems=[] } = this.props
    if (selectedItems.length == 0) return null
    return selectedItems[0]
  }

  render() {
    const { mod, className, items,
      disabled, showCount, translate, countFormatter } = this.props


    let props = this.props;
    const {bemBlocks} = props;
    return (
        <DropdownButton
          bsStyle="default"
          className="btn btn-default dropdown-toggle fdk-button fdk-button-default"
          title={this.state.selectedValue}
          key="1" id="1"
          onSelect={this.onChange}
        >
          {map(items, (item, idx) => {
            let {key, label, title, disabled, doc_count} = item;
            let text = translate(label || title || key)
            if (showCount && doc_count !== undefined) text += ` (${countFormatter(doc_count)})`
            return (
              <MenuItem key={idx} eventKey={item}>{text}</MenuItem>
            );
          })}
        </DropdownButton>

    )
  }
}