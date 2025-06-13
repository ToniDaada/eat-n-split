import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);

  const handleOpen = function () {
    setShowAddFriend(() => !showAddFriend);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList />
        {showAddFriend && <FormAddFriend />}
        <Button handleClick={handleOpen}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      <FormSplitBill />
    </div>
  );
}

function FriendsList() {
  const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend friend={friend} key={friend.id} />
      ))}
    </ul>
  );
}

function Friend({ friend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />

      <h3> {friend.name}</h3>
      <p
        className={
          friend.balance > 0 ? "green" : friend.balance === 0 ? "" : "red"
        }
      >
        {friend.balance > 0
          ? `You are owed $${Math.abs(friend.balance)} from ${friend.name}`
          : friend.balance === 0
          ? `You and ${friend.name} are even`
          : `You owe ${friend.name} $${Math.abs(friend.balance)}`}
      </p>
      <Button>Select</Button>
    </li>
  );
}

function FormAddFriend() {
  return (
    <form className="form-add-friend">
      <label>😎Friend name</label>
      <input type="text" />

      <label>🖼️ Image URL</label>
      <input type="text" />

      <Button>Add</Button>
    </form>
  );
}

function Button({ children, handleClick }) {
  return (
    <button className="button" onClick={handleClick}>
      {children}
    </button>
  );
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with X </h2>
      <label>💰Bill Value</label>
      <input type="text" />
      <label>🕴️Your expense</label>
      <input type="text" />
      <label>🧑‍🤝‍🧑X's expense</label>
      <input type="text" disabled />
      <label>💳Who is paying the bill?</label>
      <select value="user">
        <option value="user">You</option>
        <option value="friend">X</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
