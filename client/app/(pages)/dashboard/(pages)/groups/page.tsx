
export default function GroupsPage() {
    return (
        <div >
            <div >

                <div className="lg:grid grid-cols-2 gap-3">
                    <div className="mb-5 lg:mb-0">
                        <div className="bg-white rounded-2xl mb-3 h-50 lg:h-80">
                            a
                        </div>

                        <div className="bg-white rounded-2xl h-50 lg:h-80">
                            b
                        </div>


                    </div>

                    <div>
                        <div className="lg:grid lg:grid-cols-2 gap-3 lg:h-30 mb-5 lg:mb-3">
                            <div className="bg-white rounded-2xl p-4 mb-3 lg:mb-0 h-25 lg:h-full">a</div>
                            <div className="bg-white rounded-2xl p-4 h-25 lg:h-full">b</div>
                        </div>

                        <div className="lg:grid lg:grid-cols-2 gap-3 lg:h-50 mb-3 ">
                            <div className="bg-white rounded-2xl p-4 mb-3 lg:mb-0 h-25 lg:h-full">a</div>
                            <div className="bg-white rounded-2xl p-4 h-25 lg:h-full">b</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 h-50 lg:h-77 bg-stone-900 text-stone-100 rounded-2xl p-4 mb-3">
                            a
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}