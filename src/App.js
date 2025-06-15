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
  // Use State for toggling the addfriend form
  const [showAddFriend, setShowAddFriend] = useState(false);
  // Use State for updating the friends list
  const [friends, setFriends] = useState(initialFriends);
  // Use State for selecting friend
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Functions

  // Function for toggling the addfriend form
  const handleOpen = function () {
    setShowAddFriend((show) => !show);
  };

  // Function for updating the friend List
  const handleAddFriend = function (friend) {
    setFriends((friends) => [...friends, friend]);
    handleOpen();
  };

  // Handles the selection of a friend
  const handleSelection = function (friend) {
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  };

  // Handles the spliting of the bill
  const handleSplitBill = function (value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  };

  return (
    // Main content of the app
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {/* If the showAddfriend is true, show the form else do not */}
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        {/* Button that opens and closes the add friend form */}
        <Button handleClick={handleOpen}>
          {/* If Add friend is true 'Close else' show 'Add Friend' */}
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {/* If selected friend is false dont show the side bar */}
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

// The friendsList
function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

// Contains the main JSX of the friends side bar, inclusing the styling too
function Friend({ friend, onSelection, selectedFriend }) {
  // I did optional chaining because selecred friend is null originally, and you cannot find the value of null.id
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
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
      <Button handleClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

// The form to add a friend
function FormAddFriend({ onAddFriend }) {
  const [friendName, setFriendName] = useState("");
  const [imageURL, setImageURL] = useState("https://i.pravatar.cc/48");

  const handleSubmit = function (e) {
    e.preventDefault();

    if (!friendName || !imageURL) return;
    // This uses the browser API for creating ids
    const id = crypto.randomUUID();
    // Creating a newFriend Object based on the things passed into the text box that will then be added to the initialFriends Array

    const newFriend = {
      id,
      name: friendName,
      image: `${imageURL}?=${id}`,
      balance: 0,
    };

    // Updating the initialFriends Array, this was passed as a prop and now its being updated.
    onAddFriend(newFriend);

    // Returning the textboxes back to normal
    setImageURL("https://i.pravatar.cc/48");
    setFriendName("");
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>😎Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />

      <label>🖼️ Image URL</label>
      <input
        type="text"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

// The Reusable Button Component
function Button({ children, handleClick }) {
  return (
    <button className="button" onClick={handleClick}>
      {children}
    </button>
  );
}

// The function that handles the splitting of the bill, Its a form
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");

  // If the bill is empty, then the amount paid by friend is empty
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    // If the bill or bill paid by user input is empty then return, dont submit
    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name} </h2>
      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🕴️Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            // This tenary clause ensures the bill paid by the user is never higher than the actual bill
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      {/* Its disabled so the value of the input is determined by (bill - paidbyUser) */}
      <label>🧑‍🤝‍🧑{selectedFriend.name} expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label>💳Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
