'use client';

const Page = () => {
    return (
        <div className="grid">
            <div className="col-12 xl:col-4">
                <div className="card">
                    <h5>My Crafts</h5>
                    <p>Total Products: 12</p>
                </div>
            </div>

            <div className="col-12 xl:col-4">
                <div className="card">
                    <h5>Orders</h5>
                    <p>Pending Orders: 4</p>
                </div>
            </div>

            <div className="col-12 xl:col-4">
                <div className="card">
                    <h5>Earnings</h5>
                    <p>$1,240</p>
                </div>
            </div>
        </div>
    );
};

export default Page;
