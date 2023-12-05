import { useState } from "react";


function Logo() {
  return <h1>🗼 Tokyo Trip 💼</h1>
}

function Form({onAddItems}) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);


  function handleSubmit(event){

    event.preventDefault();

    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now() };

    onAddItems(newItem)
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className='add-form' onSubmit={handleSubmit}>
      <h3>What do you need for the trip?</h3>
      <select value = {quantity} onChange={(e)=>{setQuantity(Number(e.target.value))}}>
        {Array.from({length: 20}, (_, i)=>i+1).map
        ((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        )
        )}
      </select>
      <input type='text' placeholder="Item..." value={description}
      onChange={(e)=>setDescription(e.target.value)}/>
      <button>Add</button>
    </form>
  )
}

function Item({item, onDeleteItem, onToggleItem}){

  function handleDeleteItem(){
    onDeleteItem(item.id)
  }

  function handleChecked(){
    onToggleItem(item.id)
  }

  return(
  <li>
  <input type="checkbox" value={item.packed}
  onChange={handleChecked}></input>
  <span style={item.packed ? {textDecoration: "line-through"}:{}}>
  {item.quantity} {item.description}
  </span>
  <button onClick={handleDeleteItem}>❌</button>
  </li>
  )
}

function PackingList({items, onDeleteItem, onToggleItem, onClearList}) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy==='input'){
    sortedItems = items;
  }
  if (sortBy==='description'){
    sortedItems = items.slice().sort((a,b) => a.description.localeCompare(b.description));
  }
  if (sortBy==="packed"){
    sortedItems = items.slice().sort((a,b)=> Number(a.packed) - Number(b.packed));
  }

  return <div className='list'>
  <ul>
    {sortedItems.map(item=>
    <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />
    )}
  </ul>
  <div className="actions">
    <select value={sortBy} onChange={(event)=>setSortBy(event.target.value)}>
      <option value="input">Sort by input order
      </option>
      <option value="description">Sort by description
      </option>
      <option value="packed">Sort by packed
      </option>
    </select>
    <button className="button" onClick={onClearList}>Clear List</button>
  </div>
  </div>

}

function Stats({items}) {
  if (!items.length){
    return (
      <p className="stats">
        <em>Start adding some items to the packing list 😍</em>
      </p>
    )
  }

  const numItems = items.length;
  const numPacked = items.filter( (item) => item.packed).length;
  const percentage = Math.round((numPacked/numItems)*100);

  return <footer className="stats">
    <em>
      {percentage === 100? 'Everything packed! Ready to go 🛫'
      :`💼 You have ${numItems} items on your list, and you already packed ${numPacked} (${percentage}%).`}
    </em>
  </footer>
}

function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item])
  }

  function handleToggleItem(id){
    setItems(items => items.map(item => item.id == id ? {
      ...item, packed: !item.packed} : item))
    }

  function handleClearList(){
    const confirmed = window.confirm(
      "Are you sure you want to clear the packing list?"
    );
    if (confirmed){
      setItems((items)=>[]);
  }
  }

  function handleDeleteItems(id){
    setItems(items => items.filter(item=>item.id !== id))
  }
  return (
    <div className='app'>
    <Logo></Logo>
    <Form onAddItems={handleAddItems}></Form>
    <PackingList onDeleteItem={handleDeleteItems} onToggleItem={handleToggleItem} onClearList={handleClearList} items={items}></PackingList>
    <Stats items={items}></Stats>
    </div>
  );
}

export default App;
