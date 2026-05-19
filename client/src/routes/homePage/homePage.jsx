import { useEffect, useState } from 'react';
import './homePage.scss'
import SearchBar from '../../components/searchBar/SearchBar.jsx'
import Card from '../../components/card/Card.jsx'
import apiRequest from '../../lib/apiRequest.js'

function HomePage() {
    const [featuredPosts, setFeaturedPosts] = useState([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await apiRequest.get("/posts?limit=3");
                setFeaturedPosts(res.data.slice(0, 3));
            } catch (err) {
                console.log(err);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="homePage">
            <div className="heroSection">
                <div className="textContainer">
                    <div className="wrapper">
                        <h1 className='title'>
                            Find the Perfect Property for Your Lifestyle
                        </h1> 
                        <p>
                            Discover a curated selection of premium residences, from modern downtown apartments to sprawling countryside estates. Your journey to the perfect home starts here.
                        </p>
                        <SearchBar />
                        <div className="boxes">
                            <div className="box">
                                <h1>16+</h1>
                                <h2>Years of Experience</h2>
                            </div>
                            <div className="box">
                                <h1>200</h1>
                                <h2>Award Gained</h2>
                            </div>
                            <div className="box">
                                <h1>2000+</h1>
                                <h2>Property Ready</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="imgContainer">
                    <img src="/bg.png" alt="" />
                </div>
            </div>

            <div className="featuredSection">
                <h1 className="sectionTitle">Featured Properties</h1>
                <p className="sectionSubtitle">Handpicked listings just for you.</p>
                <div className="featuredGrid">
                    {featuredPosts.map(post => (
                        <Card key={post.id} item={post} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HomePage