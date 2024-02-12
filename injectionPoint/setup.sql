CREATE TABLE users(
    user_id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    nick TEXT NOT NULL
);

INSERT INTO users VALUES (1, 'admin','${injectionComplete}', 'admin@admin.net', 'NeverWrong');
INSERT INTO users VALUES (2, 'hacker','awefulPassword', 'hacker@hackers.net','NeverRight');
CREATE TABLE products (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `product` TEXT default NULL,
  `description` TEXT default NULL,
  `currency` TEXT default NULL,
  `alphanumeric` TEXT  
);

INSERT INTO products (`description`,`product`,`currency`,`alphanumeric`)
VALUES
  ("Wyatt Fernandez","luctus, ipsum leo elementum sem, vitae aliquam eros turpis non enim. Mauris quis turpis vitae purus gravida","$25.85","PXG50GUV3DE"),
  ("Zelenia Stewart","erat. Vivamus nisi. Mauris nulla. Integer urna. Vivamus molestie dapibus ligula. Aliquam erat volutpat. Nulla dignissim. Maecenas","$40.67","VCA56ONE5WY"),
  ("Minerva Wilkerson","mattis. Integer eu lacus. Quisque imperdiet, erat nonummy ultricies ornare, elit elit fermentum risus, at fringilla purus","$30.32","QTU17MBF5XW"),
  ("Noah Gould","adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui, in sodales elit erat vitae","$9.75","OEE56GAC5WE"),
  ("Tamekah Fletcher","non, lobortis quis, pede. Suspendisse dui. Fusce diam nunc, ullamcorper eu, euismod ac, fermentum vel, mauris. Integer","$63.36","ELV76LIT5NR");
