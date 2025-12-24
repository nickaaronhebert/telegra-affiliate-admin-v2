const PrepareJourney = () => {
  return (
    <div
      className="p-6 bg-white rounded-[15px]"
      style={{
        boxShadow: "0px 8px 10px 0px hsla(0, 0%, 0%, 0.08)",
      }}
    >
      <div className=" flex flex-col w-full m-auto justify-center items-center h-[calc(100vh-500px)]">
        <h2 className="text-lg font-semibold mb-4">
          Preparing your journey setup...
        </h2>
        <p className="text-base text-[#63627F] mb-6">
          Please wait while we load the next step to complete journey.
        </p>
      </div>
    </div>
  );
};
export default PrepareJourney;
