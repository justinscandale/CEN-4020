
function RecieptForm() {
  return (
    <div>

    <div className="RecieptForm">
      <h1>RecieptForm</h1>
    </div>

    <form>
        <input type="text" id="name" name="name" placeholder="Enter Name" />
        <br />
        <input type="text" id="store" name="store" placeholder=" Enter Store" />
        <br />
        <button type="submit">Submit Receipt</button>
    </form>

    </div>

  );
}

export default RecieptForm;