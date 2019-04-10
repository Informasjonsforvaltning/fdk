export const handleUpdateField = (input, event) => {
  const selectedItemURI = event.target.value;
  // Skal fjerne fra array
  if (!event.target.checked) {
    const newInput = input.value.filter(
      returnableObjects => returnableObjects.uri !== selectedItemURI
    );
    input.onChange(newInput);
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
