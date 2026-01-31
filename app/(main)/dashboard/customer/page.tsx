'use client';

const Page = () => {
    return (
        <div className="grid">
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>My Orders</h5>
                    <p>Recent purchases</p>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Wishlist</h5>
                    <p>Saved crafts</p>
                </div>
            </div>
        </div>
    );
};

export default Page;
