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
                <h2 className="content-title">Fruits</h2>
                <div className="products">
                    <div className="product">
                        <img className="product-thumb" src={require(`../img/products/fruits/bananas.jpg`)} />
                        {/* <ImageGallery items={images} showThumbnails={false} /> */}
                        <span className="product-title">Title for the product could be quite longish or not who knows.</span>
                        <span className="product-price">199€</span>
                        <span className="product-stock">33</span>
                    </div>
                    <div className="product">
                        <img className="product-thumb" src={require(`../img/products/fruits/apples.jpg`)} />
                        {/* <ImageGallery items={images} showThumbnails={false} /> */}
                        <span className="product-title">One apple a day scares doctors away.</span>
                        <span className="product-price">11.49€</span>
                        <span className="product-stock">1294</span>
                    </div>
                    <div className="product">
                        <img className="product-thumb" src={require(`../img/products/fruits/guava.jpg`)} />
                        {/* <ImageGallery items={images} showThumbnails={false} /> */}
                        <span className="product-title">Kinda short title.</span>
                        <span className="product-price">1.99€</span>
                        <span className="product-stock">3</span>
                    </div>
                    <div className="product">
                        <img className="product-thumb" src={require(`../img/products/fruits/avocados.jpg`)} />
                        {/* <ImageGallery items={images} showThumbnails={false} /> */}
                        <span className="product-title">Kinda long title with many stuff probably couple of lines with all nonsensical stuff which is totally unnecessary and ridiculous but what can we do. Life is life and adios..</span>
                        <span className="product-price">13459.99€</span>
                        <span className="product-stock">3</span>
                    </div>
                    <div className="product">
                        <img className="product-thumb" src={require(`../img/products/fruits/lemons.jpg`)} />
                        {/* <ImageGallery items={images} showThumbnails={false} /> */}
                        <span className="product-title"></span>
                        <span className="product-price">459.00€</span>
                        <span className="product-stock">3</span>
                    </div>
                    <div className="product">
                        <img className="product-thumb" src={require(`../img/products/fruits/pineapple.jpg`)} />
                        {/* <ImageGallery items={images} showThumbnails={false} /> */}
                        <span className="product-title">Normal title</span>
                        <span className="product-price">1459.99€</span>
                        <span className="product-stock">3</span>
                    </div>
                </div>
            </div>
            <div className="g3"><Footer /></div>
        </div>
    )
    
}