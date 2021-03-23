const { response } = require('express');
var UserSchema = require('../model/model.js');
let newUniqID = 0;
let BOOKID;
let USERID;


/* --------------------------------USER APIS-------------------------------- */

exports.login = (req, res) =>{
    console.log("LOGIN: ", req.body.username," | ", req.body.password)

    var username = req.body.username.trim().toLowerCase();
    var password = req.body.password.trim();
    /* payload = {
        "userID": 1004,
        "username": username,
        "password": password,
        "mobile": 9930906675,
        "email": 'admin@admin.com',
        "isAdmin": true
    } */

    console.log("username:",username)

    UserSchema.Register.find({name:username.toLowerCase(), password: password.toLowerCase()}).countDocuments()
    .then(user => {
        console.log("USER: ", user)//, payload)
        user = user.toString()
        if(user==0){
            res.status(200).send(user);//send("No user found");
        }else{
            //res.status(200).send("User found: "+ user)
            UserSchema.Register.find({name:username.toLowerCase()})//.countDocuments()//, role: 1
            .then(userRole => {
                console.log("userRole: ",userRole);
                console.log("userRole: ",userRole,userRole[0].isAdmin)
                res.status(200).send({UserID: userRole[0].userID, name: userRole[0].name, username: userRole[0].username, count: user, isAdmin: userRole[0].isAdmin});//role: userRole
            })
            // res.status(200).send({count: user, role: userRole});//REMOVED
        }
    }).catch(err => {
        console.log("ERROR: ", err)
    })
}


exports.register = async(req, res) => {
    let temp;
    temp = await UserSchema.uniqID.find()
        .then(id => {
            console.log("IDDDDDDDDDDDDDDDDD: ", id, "|", id[0].bookID, "|", id[0].userID)
            BOOKID = id[0].bookID;
            USERID = id[0].userID;
        })

    temp = await UserSchema.uniqID.updateOne({bookID: BOOKID},{userID:(USERID + 1)})
        .then(id => {
            console.log("USER ID UPDATED: ", id);//, "|", id[0].bookID, "|", id[0].userID)
        })

    payload = {
        "userID": (USERID + 1),
        "name": req.body.username.toLowerCase(),
        "username": req.body.username.toUpperCase()+(USERID + 1),
        "password": req.body.password.toLowerCase(),
        "mobile": req.body.mobile,
        "email": req.body.email,
        "isAdmin": req.body.isAdmin,
        "role": req.body.role
    }

    let userCount
    temp = await UserSchema.Register.find({username:req.body.username.toLowerCase()}).countDocuments()
                    .then(user => {
                        console.log("USERCOUNT: ", user)
                        userCount = user;
                    })
                    .catch(err=>{
                    })
                 
    if(userCount == 0){
        UserSchema.Register.create(payload)
    .then( user => {
        res.send({message: "Success"})
    })
    .catch( err => {
        res.send("Something when wrong :(")
    })
    }else{
        console.log("User astitvat ahe")
        res.send({message: "user already exist"})
    }
}

exports.getAllNonAdminUsers = async(req, res) => {
    let nonAdminUser=[];
    let i = 0;
    let nonAdminUserBooksCount =[];
    let nonAdminUserBooks =[];
    payload=[];

    await UserSchema.Register.find({isAdmin: false})
    .then(users => {
        console.log("NONADMIN users: ", users)
        //res.send(users)
        nonAdminUser = users;
        //console.log("nonAdminUser: ", nonAdminUser[0].username)
    })
    .catch(err => {
        console.log("ERROR in getAllNonAdminUsers: ", err)
    })

    for(i=0;i<nonAdminUser.length;i++){
        console.log("nonAdminUser[i].username:: ", nonAdminUser[i].username)
        //console.log("nonAdminUser.length:: ", nonAdminUser.length,"|||", nonAdminUser[i].username,"||",nonAdminUser)
        await UserSchema.booksBorrowed.find({username:nonAdminUser[i].username})// {username:nonAdminUser[i].username}
        .then(books => {
                if(books!=null || books!=undefined){
                    // console.log("USER BOOKS________::::::: ", books,"||||||||||",books[0].username,"||",books[0].Book_ID[0]);
                    // if(books.username!=null || books.username!=undefined){
                        nonAdminUserBooksCount[i] = {username:nonAdminUser[i].username, 
                        //books: (books[i]==undefined) ? null : (books[i].books), //books[0].books,
                        // books: (books[0]==undefined) ? null : (books[0].books),
                        books: (books[0]==undefined || books[0]==null) ? 0 : (books[0].books[0]),
                        assignDate: (books[0]==undefined) ? null : (books[0].assignDate), /* books[i].assignDate, */
                        returnDate: (books[0]==undefined) ? null : (books[0].returnDate), /* books[i].returnDate, */
                        assignedBy: (books[0]==undefined) ? null : (books[0].assignedBy)} /* books[i].assignedBy} */
                    // }
                }else{
                    console.log("Inside else.............")
                }

                // books: (books[i]==undefined) ? null : (books[i].books), //books[0].books,
                // assignDate: books[i].assignDate, /* books[i].assignDate, */
                // returnDate: books[i].returnDate, /* books[i].returnDate, */
                // assignedBy: books[i].assignedBy} /* books[i].assignedBy} */
        })
        //console.log("nonAdminUserBooksCount:::: ", nonAdminUserBooksCount);
    }

    console.log("nonAdminUserBooksCount.length:::::: ", nonAdminUserBooksCount.length,nonAdminUserBooksCount)
    for(i=0;i<nonAdminUserBooksCount.length;i++){
        // console.log("HEEEEEEEEEEEEEEEEEELLLLLLLLLLLLLLOOOOOOOOOOOOOOOOOOOOOOOOOOO", nonAdminUserBooksCount[i].books)
        let bookCount = ((nonAdminUserBooksCount[i].books==undefined) ? 0: nonAdminUserBooksCount[i].books);
        let temp=0;
        // console.log("bookCount.length--------------> ", bookCount.length)
        for(j=0;j<1;j++){// for(j=0;j<bookCount.length;j++){
            console.log(" nonAdminUserBooksCount.books ----", nonAdminUserBooksCount[i].books)
            await UserSchema.Book.find({Book_ID: nonAdminUserBooksCount[i].books})
                .then(book => {
                    //nonAdminUserBooks[j]=book[i];
                    if(book!=null || book!=undefined){
                        nonAdminUserBooks[i]=book[0];
                        console.log("BOOKKKKK::::::::: ", book)
                        temp = temp+1;
                    }
                })
        }
    }

    console.log("--------------------------------------------------------------------------------------",nonAdminUser.length,nonAdminUser)
    // console.log("nonAdminUser:: ", nonAdminUser)
    // console.log("nonAdminUserBooks:: ", nonAdminUserBooks)
    // console.log("nonAdminUserBooksCount:: ", nonAdminUserBooksCount)
    var j=0;
    for(i=0;i<nonAdminUser.length;i++){
        console.log("nonAdminUserBooks:::: ", nonAdminUserBooks[i])
        if(nonAdminUserBooks[i]!=undefined){
            try{
                payload[j] = {
                    userID: nonAdminUser[i].userID,
                    username: nonAdminUser[i].username,
                    password: nonAdminUser[i].password,
                    mobile: nonAdminUser[i].mobile,
                    email: nonAdminUser[i].email,
                    isAdmin: nonAdminUser[i].isAdmin,
                    Book_ID: nonAdminUserBooks[i].Book_ID,
                    Book_Name: nonAdminUserBooks[i].Book_Name,
                    Author_Name: nonAdminUserBooks[i].Author_Name,
                    Publication: nonAdminUserBooks[i].Publication,
                    assignedBy: (nonAdminUserBooksCount[i].assignedBy==undefined) ? 0:nonAdminUserBooksCount[i].assignedBy,
                    assignDate: (nonAdminUserBooksCount[i].assignDate==undefined) ? 0:nonAdminUserBooksCount[i].assignDate,
                    returnDate: (nonAdminUserBooksCount[i].returnDate==undefined) ? 0:nonAdminUserBooksCount[i].returnDate,
                    Price: nonAdminUserBooks[i].Price,
                    Count: nonAdminUserBooks[i].Count
                }
    
                console.log("payload::: ", payload[j])
            }
            catch{
                res.send({message:"Some error occured while fetching books"})
            }
            j++;
        }
        /* catch{
            res.send({message:"Some error occured while fetching books"})
        } */
    }
    // console.log("nonAdminUser: ", nonAdminUser)
    // console.log("nonAdminUserBooks: ", nonAdminUserBooks)
    // console.log("nonAdminUserBooksCount: ", nonAdminUserBooksCount)
    console.log("Payload:: ", payload)
    res.send(payload);
}


exports.getUserBooksByID = async(req, res) => {
    let username;
    let userDetails; 
    let payload;
    let finalPayload=[];
    let userBookLog=[];
    let userBook=[];

    console.log("USERID: ", req.body.id)

    await UserSchema.Register.findOne({userID: req.body.id})
        .then(uname => {
            console.log("USERNAME: ", uname);
            username = uname.username;
            console.log("USERNAME::::::: ", username)
        })
        .catch(err => {
            console.log("Error fetching username: ",err)
        })

    await UserSchema.userLog.findOne({username: username})//({username: req.body.username})
        .then(userHistory => {
            console.log("userHistory:: ", userHistory)
            userDetails = userHistory;
        })

    if(userDetails!=null || userDetails!=undefined){
        console.log("--- userDetails.books.length --- ", userDetails.books.length)
        for(i=0; i<userDetails.books.length;i++){
            await UserSchema.Book.findOne({Book_ID: userDetails.books[i]})
                .then(bookDetail => {
                    console.log("bookDetailARRAY:: ", bookDetail)
                    userBookLog[i] = bookDetail;
                })
        }
        console.log("--- userBookLog --- ", userBookLog)
    }
        await UserSchema.booksBorrowed.findOne({username: username})
            .then( userBook => {
                console.log("userBook:: ", userBook)
                payload = userBook;
            })

        // console.log("payload.books[0]::::::::: ", payload ,payload.Book_ID[0])

        if(payload!=null || payload!=undefined){
            await UserSchema.Book.findOne({Book_ID: payload.Book_ID[0]})
                .then(bookDetail => {
                    console.log("bookDetail:: ", bookDetail)
                    userBook[0] = bookDetail;
                })
        }
    


    /* for(i=0;i<userDetails.books.length;i++){
        userBook[i+1].Book_Name = userBookLog[i].Book_Name
        userBook[i+1].Author_Name = userBookLog[i].Author_Name
        userBook[i+1].Publication = userBookLog[i].Publication
    } */
    


    if(userDetails!=null || userDetails!=undefined){
        console.log("userBook--------------------------------> ", userBook)
        userBook = userBook.concat(userBookLog)
        console.log("userBook++++++++++++++++++++++++++++++++++> ", userBook)

        finalPayload = userDetails;

        console.log("<-------finalPayload----------> ", finalPayload, ((userDetails.books.length)+(payload.Book_ID.length)))
        
        if(payload!=null || payload!=undefined){
            for(i=userDetails.books.length;i<((userDetails.books.length)+(payload.Book_ID.length));i++){
                finalPayload.assignedBy[i] = payload.assignedBy,
                finalPayload.assignDate[i] = payload.assignDate,
                finalPayload.returnDate[i] = payload.returnDate
                console.log("LOOP LOG::::::::::::::::::: ",finalPayload.assignedBy[i])
            }
            finalPayload.books = finalPayload.books.concat(payload.Book_ID);
        }

        //console.log("LOG: ", (userDetails.books.length)," +++ ", ((userDetails.books.length)+(payload.books.length)))
        console.log("***********************************************************************************")
        console.log("userDetails: ", userDetails)
        console.log("payload: ", payload)
        console.log("finalPayload: ", finalPayload)
        console.log("userBookLog: ", userBookLog)
        console.log("userBook: ", userBook)
        console.log("***********************************************************************************")

    }else{
        finalPayload = userBook;
    }

    let finalPayload1=[];
    let tempPayload = {books: null, Book_Name: null, Author_Name: null, Publication: null, assignedBy: null, assignDate: null, returnDate: null}
    
    // console.log("userDetails.books.length:::::::: ", tempPayload.length,(userDetails.books.length))
        console.log("*** userDetails *** :", userDetails)
        if(userDetails!=null || userDetails!=undefined){

            for(j=0;j<userDetails.books.length;j++){
                tempPayload.username = userDetails.username;
                tempPayload.Book_ID = userDetails.books[j];
                tempPayload.assignedBy = userDetails.assignedBy[j];
                tempPayload.assignDate = userDetails.assignDate[j];
                tempPayload.returnDate = userDetails.returnDate[j];
                tempPayload.Book_Name = userBook[j].Book_Name;
                tempPayload.Author_Name = userBook[j].Author_Name;
                tempPayload.Publication = userBook[j].Publication;
                console.log("TEMP:::: ", tempPayload)
                console.log("userDetails:::: ", userDetails.assignedBy[j])
    
                finalPayload1[j]=JSON.stringify(tempPayload);
            }
            // finalPayload1.reverse();
        }else if(payload!=null || payload!=undefined){
            // console.log("INside ELSE part: ", payload,payload.assignedBy)
            let finalPayload0 = {Book_ID: null, Book_Name: null, Author_Name: null, Publication: null, assignedBy: null, assignDate: null, returnDate: null}
            // finalPayload1 = userBook;
            /* finalPayload1.Book_ID = payload.books[0];
            finalPayload1.username = payload.username;
            finalPayload1.assignedBy = payload.assignedBy;
            finalPayload1.assignDate = payload.assignDate;
            finalPayload1.returnDate = payload.returnDate; */
            let temp = [];
            let temp1 = [];
            await UserSchema.booksBorrowed.findOne({username: payload.username})
                .then( userBook => {
                    console.log("userBook:: ", userBook)
                    temp[0] = userBook;
                })
            await UserSchema.Book.findOne({Book_ID: temp[0].Book_ID})
                .then(BOOOOK => {
                    console.log("BOOOOK::::::::::::: ", BOOOOK);
                    temp1 = BOOOOK;
                })
                console.log("temp ", temp)
                // console.log("temp1.Book_Name: ", temp1,temp1.Book_Name)
                finalPayload0.username = temp[0].username;
                finalPayload0.assignedBy = temp[0].assignedBy;
                finalPayload0.assignDate = temp[0].assignDate;
                finalPayload0.returnDate = temp[0].returnDate;
                finalPayload0.Book_ID = temp1.Book_ID;
                finalPayload0.Book_Name = temp1.Book_Name;
                finalPayload0.Author_Name = temp1.Author_Name;
                finalPayload0.Publication = temp1.Publication;
                finalPayload1[0]=JSON.stringify(finalPayload0);
        }else{

        }
    console.log("finalPayload1: ", finalPayload1)
    // finalPayload1.reverse();
    res.send(finalPayload1)
}


exports.getAllUsers = (req,res) => {
    UserSchema.Register.find()
    .then(users => {
        console.log({"All Users: ": users})
        res.send(users);
    })
    .catch(err => {
        res.send("Error: ", err);
    })
}





/* --------------------------------BOOK APIS-------------------------------- */

exports.getAllBooks = (req, res) => {
    UserSchema.Book.find()
    .then(book => {
        console.log("Books: ", book)
        res.send(book);
    })
    .catch(err => {
        console.log("ERROR:: ", err);
        res.send(err);
    })
}


exports.addBook = async(req, res) => {
    let temp;
    temp = await UserSchema.uniqID.find()
        .then(id => {
            console.log("IDDDDDDDDDDDDDDDDD: ", id, "|", id[0].bookID, "|", id[0].userID)
            BOOKID = id[0].bookID;
            USERID = id[0].userID;
        })

    temp = await UserSchema.uniqID.updateOne({userID:USERID},{bookID: (BOOKID + 1)})
        .then(id => {
            console.log("BOOK ID UPDATED: ", id);//, "|", id[0].bookID, "|", id[0].userID)
        })
    console.log("TEMP: ", temp,"|",BOOKID,"|",USERID)

    searchBookPayload = {
        "Book_Name": req.body.bookName.toUpperCase(),
        "Author_Name": req.body.authorName.toUpperCase(),
        "Publication": req.body.publication.toUpperCase()   
    }
    console.log("searchBookPayload: ", searchBookPayload);

    UserSchema.Book.find(searchBookPayload).countDocuments()
        .then(book => {
            console.log("Books searched: ", book)
            
            if(book == '0'){
                /* UserSchema.uniqID.find()
                .then(id => {
                    console.log("IDDDDDDDDDDDDDDDDD: ", id,"|",id[0].uniqID)
                    newUniqID = id[0].uniqID;
                }) */

                /* console.log("Updated ID: ", (newUniqID+1))
                UserSchema.uniqID.updateOne({uniqID:newUniqID},{uniqID:(newUniqID+1)})
                    .then(uniqID => {
                        console.log("uniqID: ", uniqID)
                    })
                    .catch(err => {
                        console.log("ERROR in uniqID::::::::::: ", err)
                    }) */

                payload = {
                    "Book_ID": (BOOKID+1),
                    "Book_Name": req.body.bookName.toUpperCase(),
                    "Author_Name": req.body.authorName.toUpperCase(),
                    "Publication": req.body.publication.toUpperCase(),
                    "Price": req.body.price,
                    "Count": 1
                }
                UserSchema.Book.create(payload)
                    .then(book => {
                        console.log("BOOK CREATED: ",book)
                        res.send({status: 0});
                    })
                    .catch(err => {
                        console.log("Something went wrong :( ", err)
                    })

                /* temp = await UserSchema.uniqID.updateOne({userID:USERID},{bookID: (BOOKID + 1)})
                .then(id => {
                    console.log("BOOK ID UPDATED: ", id, "|", id[0].bookID, "|", id[0].userID)
                }) */
            }else{
                console.log("Book Already exists");
                console.log("BOOK::::::::: ", book)
                UserSchema.Book.find(searchBookPayload)
                .then(book => {
                    console.log("BOOK KA COUNT THA::::::::: ", book[0].Count)
                    let inc = book[0].Count;
                    UserSchema.Book.updateOne(searchBookPayload,{Count: (inc + 1)}, {upsert: true})
                        .then(book => {
                        console.log("Update Successful!!!!!")
                        //res.send({status: 2});  //STATUS 2 for UPDATE,1 for EXIST and 0 for INSERT
                        })
                        .catch(err => {
                        console.log("ERROR updating BOOK:: ", err);
                        res.send(err); 
                    })
                })
                .catch(err => {
                    console.log("ERROR:: ", err);
                    res.send(err);
                })
                res.send({status: 1});                
            }
        })
        .catch( err => {
            console.log("ERROR:: ", err);
            res.send(err);
        })

        /* if(book == '0'){
            payload = {
                "Book_ID": req.body.username,
                "Book_Name": req.body.bookName,
                "Author_Name": req.body.authorName,
                "Publication": req.body.publication,
                "Price": req.body.price,
                "Count": req.body.count
            }
            UserSchema.Book.create(payload)
            .then(book => {
                console.log("BOOK CREATED: ",book)
                res.send(book);
            })
            .catch(err => {
                console.log("Something went wrong :(")
            })
        }else{
            console.log("Book Already exits.....Just increment the count ;)")
        } */
}


exports.searchBookByName = async(req, res) => {
    console.log("BOOK NAME: ", req.body.bookName.toUpperCase())
    var searchWord = {Book_Name : '*' + req.body.bookName.toUpperCase() + '*'}

    await UserSchema.Book.findOne({Book_Name : req.body.bookName.toUpperCase()})
        .then(book => {
            console.log("Book : ", book)
            res.send(book)
        })
    
}

exports.searchBookByAuthorName = async(req, res) => {
    console.log("AUTHOR NAME: ", req.body.authorName.toUpperCase())

    await UserSchema.Book.findOne({Author_Name : req.body.authorName.toUpperCase()})
        .then(book => {
            console.log("Book : ", book)
            res.send(book)
        })
}



exports.addBookInRequestQueue = async(req, res) => {
    let usercount;
    console.log("USERNAME::::::: ", req.body.username)

    await UserSchema.RequestBook.findOne({username: req.body.username}).countDocuments()
        .then(user => {
            console.log("user count: ", user)
            usercount = user;
        })

    if(usercount == 1){
        console.log("USER EXIST")
        await UserSchema.RequestBook.updateOne({username: req.body.username},{Book_ID: req.body.bookID, Book_Name: req.body.bookName})
            .then(response => {
                console.log("response: ", response)
                res.send(response);
            })
    }else if(usercount == 0){
        console.log("USER DOES NOT EXIST")
        await UserSchema.RequestBook.create({username: req.body.username, Book_ID: req.body.bookID, Book_Name: req.body.bookName})
            .then(response => {
                console.log("response: ", response)
                res.send(response);
            })
    }else{
        res.send("Something went wrong!")
    }

    // res.send(response);
}


exports.getBookInRequestQueue = async(req, res) => {
    console.log("USERNAME::::::: ", req.body.username)
    await UserSchema.RequestBook.findOne({username: req.body.username})
        .then(user => {
            console.log("USER: ", user)
            res.send(user)
        })
}


exports.getAllBooksInRequest = (req, res) => {
    UserSchema.RequestBook.find()
        .then(user => {
            console.log("USER: ", user)
            res.send(user)
        })
}



exports.approveRejectBook = async(req, res) => {
    let approvedBookCount;
    let count;
    let user;
    var now = new Date();
    var returnDate = new Date((new Date()).getTime() + (7 * 86400000));
    console.log("PAYLOAD: ", req.body.username, req.body.Book_ID, req.body.Book_Name, req.body.action)

    if(req.body.action == 'approve'){
        console.log("Approve")
        await UserSchema.booksBorrowed.findOne({username: req.body.username}).countDocuments()
            .then(userCount => {
                console.log("User Count: ", userCount)
                count = userCount;
            })

            if(count>=1){
                console.log("User hasn't returned the previous book")
                //res.send({message: "User hasn't returned the previous book"})
            }else{
                await UserSchema.booksBorrowed.create( 
                    {Book_ID:req.body.Book_ID, 
                    books:req.body.Book_ID,
                    username: req.body.username,
                    assignedBy: req.body.admin, 
                    assignDate: (now) , 
                    returnDate: (returnDate)})
                    .then(user => {
                        console.log("Updated user records: ", user)
                        res.send({message: "Success"})
                    })
                    .catch(err => {
                        console.log("ERROR updating user books: ",err)
                        res.send({message: "Error"})
                    })

                    // Decrement book count in Books schema
                await UserSchema.Book.findOne({Book_ID: req.body.Book_ID})
                    .then(approvedBook => {
                        console.log("Approved Book::: ", approvedBook)
                        approvedBookCount = approvedBook.Count;
                        console.log("Approved Book Count::: ", approvedBookCount)
                    })

                    approvedBookCount = (approvedBookCount-1);

                await UserSchema.Book.updateOne({Book_ID: req.body.Book_ID},{Book_ID: req.body.Book_ID, Count: approvedBookCount},{upsert: true})
                    .then(updateBookCount => {
                        console.log("Book Count updated successfully:::::::: ", updateBookCount);
                    })
                    .catch(err => {
                        console.log("ERROR occured updating Book Count: ",err)
                    })

                await UserSchema.RequestBook.deleteOne({username: req.body.username})
                    .then(del => {
                        console.log("Deleted: ", del)
                    })

                await UserSchema.RequestBook.find()
                    .then(user => {
                        console.log("USER: ", user)
                        // res.send(user)
                    })
                // res.send(user)
            }

        await UserSchema.RequestBook.find()
            .then(user => {
                console.log("USER: ", user)
                res.send(user)
            })
        // res.status(200).send(user)
        // res.send({message:"Approveed"})
    }else if(req.body.action == 'reject'){
        console.log("Reject")
        await UserSchema.RequestBook.deleteOne({username: req.body.username})
            .then(del => {
                console.log("Deleted: ", del)
            })

        await UserSchema.RequestBook.find()
            .then(user => {
                console.log("USER: ", user)
                res.send(user)
            })
        // res.send(user)
    }else{
        console.log("OPPS!! something went wrong :(")
        res.send({message:"OPPS!! something went wrong :("})
    }
}






/* --------------------------------ASSIGN BOOKS APIS-------------------------------- */

exports.updateUsersBooks = async(req, res)=> {
    var userHistory = [];
    var userCurrentBooks = [];
    var i=0;
    var j=0;
    var now = new Date();
    var returnDate = new Date((new Date()).getTime() + (7 * 86400000));
    console.log("INSIDE booksBorrowed |", req.body.username,"||||", req.body)
    payload = {
        "username": req.body.username
    }

    await UserSchema.userLog.findOne(payload)
    .then(history => {
        console.log("User history-------> ", history);
        userHistory = history;
    })
    .catch(err => {
        console.log("Error fetching user history..........", err);
    })

    await UserSchema.booksBorrowed.findOne(payload)
    .then(currentBooks => {
        console.log("User current records-------> ", currentBooks);
        userCurrentBooks = currentBooks;
    })
    .catch(err => {
        console.log("Error fetching user current records..........", err);
    })
    console.log("userHistory: ", userHistory,"| userCurrentBooks: ", userCurrentBooks)
    
    if(userHistory!=undefined || userHistory!=null){
        var k=(userHistory.books.length+userCurrentBooks.books.length);
        for(i=userHistory.books.length;i<k;i++){
            userHistory.books[i]=userCurrentBooks.books[j];
            j++
        }

        i=userHistory.assignedBy.length;
        userHistory.assignedBy[i]=userCurrentBooks.assignedBy;
        userHistory.assignDate[i]=userCurrentBooks.assignDate;
        userHistory.returnDate[i]=userCurrentBooks.returnDate;
    }else{
        userHistory={
            books: [],
            assignedBy: [],
            assignDate: [],
            returnDate: [],
            username: null
        }
    }

    console.log("userHistory: ", userHistory,"| userCurrentBooks: ", userCurrentBooks)

    /* <<-----------------HAVE TO WORK ON THIS PART BEFORE EXECUTION----------------->> */
    /* <<-----------------DONE----------------->> */

    await UserSchema.userLog.updateOne(payload,userHistory,{upsert: true})
    .then(userData => {
        console.log("Successfully updated the user history in UserLOGs table: ", userData)
    })
    .catch(err => {
        console.log("Error updating user History logs: ", err)
    })
    
    await UserSchema.booksBorrowed.updateOne(payload, 
        {books:req.body.books, 
        assignedBy: req.body.admin, 
        assignDate: (now) , 
        returnDate: (returnDate)},
        {upsert: true})
    .then(user => {
        console.log("Updated user records: ", user)
        res.send({message: "Success"})
    })
    .catch(err => {
        console.log("ERROR updating user books: ",err)
        res.send({message: "Error"})
    })
}


exports.getBooksByUser = async(req, res, next) => {
    let bookIDs=[];
    let userDetails = [];
    let BookArray=[];
    let finalPayload = [];
    payload = {
        "username": req.body.username
    }

    await UserSchema.booksBorrowed.findOne(payload)
    .then(user => {
        console.log("USER BOOKS: ", user)
        bookIDs = user.books;
        userDetails = user;
        console.log("bookIDs: ", bookIDs)
    })
    .catch(err => {
        console.log("ERROR getting borrowed book details: ", err)
    })

    
    let i;
    for(i=0;i<bookIDs.length;i++){
        console.log("BOOK: ", bookIDs[i])
        await UserSchema.Book.find({Book_ID: bookIDs[i]})
            .then(bookDetail => {
                BookArray[i] = bookDetail[0]
                console.log("BookArray: ", BookArray[i])
            })
    //}
    //res.send(BookArray)
        finalPayload[i] = {
            Book_ID: BookArray[i].Book_ID,
            Book_Name: BookArray[i].Book_Name,
            Author_Name: BookArray[i].Author_Name,
            Publication: BookArray[i].Publication,
            assignDate: (userDetails.assignDate==undefined) ? null : userDetails.assignDate,
            assignedBy: (userDetails.assignedBy==undefined) ? null : userDetails.assignedBy,
            returnDate: (userDetails.returnDate==undefined) ? null : userDetails.returnDate
        }
    }
    res.send(finalPayload);
}



exports.returnBook = async(req, res) => {
    var userHistory = [];
    var userCurrentBooks = [];
    let users;
    var approvedBookCount;
    var i=0;
    var j=0;

    payload = {
        "username": req.body.username
    }

    await UserSchema.userLog.findOne(payload)
    .then(history => {
        console.log("User history-------> ", history);
        userHistory = history;
    })
    .catch(err => {
        console.log("Error fetching user history..........", err);
    })

    await UserSchema.booksBorrowed.findOne(payload)
    .then(currentBooks => {
        console.log("User current records-------> ", currentBooks);
        userCurrentBooks = currentBooks;
    })
    .catch(err => {
        console.log("Error fetching user current records..........", err);
    })
    console.log("userHistory: ", userHistory,"| userCurrentBooks: ", userCurrentBooks)

    // Increment book count in Books schema

    await UserSchema.Book.findOne({Book_ID: userCurrentBooks.Book_ID[0]})
        .then(approvedBook => {
            console.log("Approved Book::: ", approvedBook)
            approvedBookCount = approvedBook.Count;
            console.log("Approved Book Count::: ", approvedBookCount)
        })

        approvedBookCount = (approvedBookCount+1);

    await UserSchema.Book.updateOne({Book_ID: userCurrentBooks.Book_ID[0]},{Count: approvedBookCount},{upsert: true})
        .then(updateBookCount => {
            console.log("Book Count updated successfully:::::::: ", updateBookCount);
        })
        .catch(err => {
            console.log("ERROR occured updating Book Count: ",err)
        })
    
    if(userHistory!=undefined || userHistory!=null){
        var k=(userHistory.books.length+userCurrentBooks.books.length);
        for(i=userHistory.books.length;i<k;i++){
            userHistory.books[i]=userCurrentBooks.books[j];
            j++
        }

        i=userHistory.assignedBy.length;
        userHistory.assignedBy[i]=userCurrentBooks.assignedBy;
        userHistory.assignDate[i]=userCurrentBooks.assignDate;
        userHistory.returnDate[i]=userCurrentBooks.returnDate;
    }else{
        userHistory={
            books: [],
            assignedBy: [],
            assignDate: [],
            returnDate: [],
            username: null
        }
    }

    console.log("userHistory: ", userHistory,"| userCurrentBooks: ", userCurrentBooks)

    await UserSchema.userLog.updateOne(payload,userHistory,{upsert: true})
        .then(userData => {
            console.log("Successfully updated the user history in UserLOGs table: ", userData)
        })
        .catch(err => {
            console.log("Error updating user History logs: ", err)
        })

    await UserSchema.booksBorrowed.deleteOne({username: req.body.username})
        .then(delRecord => {
            console.log("delRecord: ", delRecord)
        })
        .catch(err => {
            console.log("Error while deleting user records: ", err)
        })
    
    await UserSchema.Register.find({isAdmin: false})
        .then(users => {
            console.log("NONADMIN users: ", users)
            users = users;
            //console.log("nonAdminUser: ", nonAdminUser[0].username)
        })
        .catch(err => {
            console.log("ERROR in getAllNonAdminUsers: ", err)
        })

    res.send(users)
    /* await UserSchema.booksBorrowed.updateOne(payload, 
        {books:req.body.books, 
        assignedBy: req.body.admin, 
        assignDate: (now) , 
        returnDate: (returnDate)},
        {upsert: true})
    .then(user => {
        console.log("Updated user records: ", user)
        res.send({message: "Success"})
    })
    .catch(err => {
        console.log("ERROR updating user books: ",err)
        res.send({message: "Error"})
    }) */
}