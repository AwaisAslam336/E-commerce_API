# E-commerce_API (NodeJS, MongoDB)
1.Ensure you have Node.js installed.

2.Create a Mongo Atlas database online or start a local MongoDB database.

3. create .env file and add...

        ACCESS_TOKEN_SECRET=exampleSecret1
        REFRESH_TOKEN_SECRET=exampleSecret2
        EMAIL_USER=your mail account
        EMAIL_PASSWORD=your app password
        MONGO_URL=your mongo URL

4.In the terminal,

        run: npm install

5.use Routes mentioned below:

http://localhost:8000/api/user/login (Post)

http://localhost:8000/api/user/register (Post)

http://localhost:8000/api/user/update-password (Post)

http://localhost:8000/api/user/forget-password (Post)

http://localhost:8000/api/user/reset-password (Post)

http://localhost:8000/api/user/logout (get)

http://localhost:8000/api/user/count (get)

http://localhost:8000/api/category/count (get)

http://localhost:8000/api/category/add (post)

http://localhost:8000/api/sub-category/count (get)

http://localhost:8000/api/sub-category/add (post)

http://localhost:8000/api/store/create (post)

http://localhost:8000/api/store/find-nearest (post)

http://localhost:8000/api/store/count (get)

http://localhost:8000/api/product/add (post)

http://localhost:8000/api/product/get (get)

http://localhost:8000/api/product/search (get)

http://localhost:8000/api/product/count (get)

http://localhost:8000/api/cart/add-to-cart (post)

http://localhost:8000/api/refresh-token (get)
