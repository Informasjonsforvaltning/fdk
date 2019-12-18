export const removeValueFromInputValueArray = (input, removedUri) => {
  const newInputValue = input.value.filter(
    inputValue => inputValue.uri !== removedUri
  );
  input.onChange(newInputValue);
};

export const handleUpdateField = (input, event) => {
  const selectedItemURI = event.target.value;
  // Skal fjerne fra array
  if (!event.target.checked) {
    removeValueFromInputValueArray(input, selectedItemURI);
  } else {
    // add object
    let updates = [];
    updates = input.value.map(item => item);
    const addItem = {
      uri: selectedItemURI
    };

    updates.push(addItem);
    input.onChange(updates);
  }
};
