import React from 'react';
import PropTypes from 'prop-types';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import './tabs.component.scss';

const renderTabContent = (tabContent, activeTab) => {
  if (!tabContent) {
    return null;
  }

  const items = items =>
    items.map((item, index) => (
      <TabPane key={index} tabId={index}>
        {item.body}
      </TabPane>
    ));

  return (
    <TabContent className="pb-4" activeTab={activeTab}>
      {items(tabContent)}
    </TabContent>
  );
};

export class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.renderNavItems = this.renderNavItems.bind(this);
    this.state = {
      activeTab: 0
    };
  }

  toggle(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  renderNavItems(tabContent, activeTab) {
    if (!tabContent) {
      return null;
    }

    const navItems = (items, activeTab) =>
      items.map((item, index) => (
        <NavItem key={index}>
          <NavLink
            className={classnames({ active: activeTab === index })}
            onClick={() => {
              this.toggle(index);
            }}
          >
            {item.title}
          </NavLink>
        </NavItem>
      ));

    return <Nav tabs>{navItems(tabContent, activeTab)}</Nav>;
  }

  render() {
    const { activeTab } = this.state;
    const { tabContent } = this.props;
    return (
      <>
        {this.renderNavItems(tabContent, activeTab)}
        {renderTabContent(tabContent, activeTab)}
      </>
    );
  }
}

Tabs.defaultProps = {
  tabContent: null
};

Tabs.propTypes = {
  tabContent: PropTypes.array
};
