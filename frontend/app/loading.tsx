export default function Loading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                {/* Fancy Loader */}
                <div className="loader"></div>

                {/* Loading Text */}
                <p className="text-[#0c1b33] font-semibold text-lg animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
}
