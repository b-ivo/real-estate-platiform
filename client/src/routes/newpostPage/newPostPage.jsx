import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "./newPostPage.scss";

function NewPostPage() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          latitude: parseFloat(inputs.latitude),
          longitude: parseFloat(inputs.longitude),
          type: inputs.type,
          property: inputs.property,
          images: images.length > 0 ? images : ["https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
        },
        postDetail: {
          desc: inputs.description,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: inputs.size ? parseInt(inputs.size) : null,
          school: inputs.school ? parseInt(inputs.school) : null,
          bus: inputs.bus ? parseInt(inputs.bus) : null,
          restaurant: inputs.restaurant ? parseInt(inputs.restaurant) : null,
        },
      });
      navigate(`/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required min={0} />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="description">Description</label>
              <textarea name="description" id="description" rows={4} required />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="number" step="any" required />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="number" step="any" required />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" id="type">
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select name="property" id="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" id="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" id="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input id="income" name="income" type="text" placeholder="e.g. Must have 3x the rent" />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School (meters away)</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus Stop (meters away)</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant (meters away)</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            {error && <span className="error">{error}</span>}
            <button className="sendButton" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Post"}
            </button>
          </form>
        </div>
      </div>
      <div className="sideContainer">
        <h3>Upload Property Photos</h3>
        <div className="uploadWrapper">
          <UploadWidget 
            uwConfig={{
              cloudName: "gw_realestate",
              uploadPreset: "estate",
              multiple: true,
              maxImageFileSize: 2000000,
              folder: "posts",
            }}
            setState={setImages}
          />
        </div>
        <div className="imageList">
          {images.map((img, i) => (
            <div key={i} className="imageItem">
              <img src={img} alt={`img-${i}`} />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
              >
                ✕
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <p className="noImages">No images uploaded yet. A high-quality placeholder will be used if none provided.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
