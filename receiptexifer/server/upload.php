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
    <?php
    $target_dir = "uploads/";
    $uplFilename = basename($_FILES["receipt"]["name"]);
    $imageFileType = strtolower(pathinfo($uplFilename, PATHINFO_EXTENSION));
    // We only want unique filenames, no duplicates!

    $filename = uniqid() . ".$imageFileType";
    $target_file = $target_dir . $filename;
    $uploadOk = 1;
    $uploadedFileTmp = $_FILES["receipt"]["tmp_name"];
    // We only want real images... otherwise this would be dangerous right?
    if (isset($_POST["submit"])) {
        $check = getimagesize($uploadedFileTmp);
        if ($check !== false) {
            echo "Genuine  <strong>" . $check["mime"] . "</strong> image.";
            $uploadOk = 1;
        } else {
            echo "<strong class='danger'>Invallid image file!</strong>";
            $uploadOk = 0;
        }
    }
    if ($uploadOk == 0) {
        echo "Upload failed, try again...";
    } else {
        move_uploaded_file($uploadedFileTmp, $target_file);
        echo "File available at <a href='$target_file'><img src='$target_file' class='img-thumbnail'/>$target_file</a>";
    }
    ?>
</body>

</html>