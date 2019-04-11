import _ from 'lodash';

export const matchInputStateToLosTerm = (state, value) => {
  const inputValue = value;
  const inputValueLength = inputValue.length;
  return (
    _.includes(
      state.name.nb.slice(0, inputValueLength).toLowerCase(),
      inputValue.toLowerCase()
    ) ||
    _.filter(
      _.get(state, 'synonyms'),
      item =>
        item.slice(0, inputValueLength).toLowerCase() ===
        inputValue.toLowerCase()
    ).length > 0
  );
};

export const onClearSearchInput = (
  handleSetFilterText,
  handleSetSearchedItem
) => {
  handleSetFilterText('');
  handleSetSearchedItem(undefined);
};

export const onChangeSearchInput = (
  event,
  handleSetFilterText,
  handleSetSearchedItem
) => {
  event.preventDefault();
  const newValue = event.target.value;
  if (newValue === '') {
    onClearSearchInput(handleSetFilterText, handleSetSearchedItem);
  } else {
    handleSetFilterText(newValue);
  }
};

export const onSelectSearchedLosItem = (
  filterText,
  item,
  handleSetFilterText,
  handleSetSearchedItem
) => {
  if (filterText === '') {
    onClearSearchInput(handleSetFilterText, handleSetSearchedItem);
  } else {
    handleSetFilterText(filterText);
    handleSetSearchedItem(item);
  }
};
