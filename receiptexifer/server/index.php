<html>

<head>
    <title>
        Upload Your Receipts
    </title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</head>

<body>
    <h1>Receipt Uploader</h1>
    <p>We have made this nifty upload tool to upload receipts, currently we are following agile and lean methods, so this is an <strong>MVP</strong> at moment, only supporting the upload part. But stay tuned for more!</p>
    <form action="upload.php" method="post" enctype="multipart/form-data">
        <div class="form-group">
            <label>Select image of receipt to upload:</label>
            <input class="form-control" type="file" name="receipt" id="receipt">
            <button type="submit" value="Upload Image" name="submit">Upload</button>
        </div>
    </form>
</body>

</html>