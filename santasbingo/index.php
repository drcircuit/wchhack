<?php
include 'config.php'; 

if (preg_match('/config\.php\/*$/i', $_SERVER['PHP_SELF'])) {
  exit("Ha ha ha! You didn't say the magic word!! And this is not a Unix System... oh wait...");
}

if (isset($_GET['test'])) {
  highlight_file(basename($_SERVER['PHP_SELF']));
  exit();
}

$secret = bin2hex(random_bytes(64));
if (isset($_POST['guess'])) {
  $guess = (string) $_POST['guess'];
  if (hash_equals($secret, $guess)) {
    $msg = 'Yay! The flag is: ' . FLAG;
  } else {
    $msg = 'Too bad...';
  }
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Santas Bingo!</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <style>
        body{
            background-image: url("/santasbattle.png");
            background-size: cover;
            background-repeat: no-repeat;
            color: lightcoral;
        }
        .container{
            background-color: rgba(0,0,0,0.6);
        }
    </style>
</head>
  <body>
    <div class="container">
    <h1>Make a guess!</h1>
    <p>This is not a normal bingo, you only need to get one right, and you will get a present!</p>
    <p><a href="?test">Test - ignore...</a></p>
    <hr>
<?php if (isset($msg)) { ?>
    <p><?= $msg ?></p>
<?php } ?>
    <form action="index.php" method="POST">
      <input type="text" name="guess">
      <input type="submit">
    </form>
    </div>
  </body>
</html>