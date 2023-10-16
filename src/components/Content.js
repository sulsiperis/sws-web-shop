import Header from "./Header"
import Footer from "./Footer"
import Menu from "./Menu"
import ImageGallery from "react-image-gallery";

export default function Content(props) {
    const images = [
        {
          original: "https://picsum.photos/id/1018/1000/600/",
          thumbnail: "https://picsum.photos/id/1018/250/150/",
          thumbnailHeight: "122px", 
          thumbnailWidth: "122px",
          originalHeight: "200px",
          originalWidth: "200px",
        },
        {
          original: "https://picsum.photos/id/1015/1000/600/",
          thumbnail: "https://picsum.photos/id/1015/250/150/",
          thumbnailHeight: "122px", 
          thumbnailWidth: "122px",
          originalHeight: "200px",
          originalWidth: "200px",
        },
        {
          original: "https://picsum.photos/id/1019/1000/600/",
          thumbnail: "https://picsum.photos/id/1019/250/150/",
          thumbnailHeight: "122px", 
          thumbnailWidth: "122px",
          originalHeight: "200px",
          originalWidth: "200px",
        },
    ];
    return (
        <div className="main">
            <div className="g1"><Header changeIntro={props.changeIntro} /></div>
            <div className="g2"><Menu /></div>
            <div className="content">
                <div className="products">
                    <div className="product">
                        <img className="product-thumb" src={require(`../img/products/fruits/bananas.jpg`)} />
                        {/* <ImageGallery items={images} showThumbnails={false} /> */}
                        <span className="product-title">Title for the product could be quite longish or not who knows.</span>
                        <span className="product-price">199€</span>
                        <span className="product-stock">33</span>
                    </div>
                </div>

                main content
            </div>
            <div className="g3"><Footer /></div>
        </div>
    )
    
}