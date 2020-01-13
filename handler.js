var oneDriveAPI = require('onedrive-api');

let accessToken = "EwB4A8l6BAAUO9chh8cJscQLmU+LSWpbnr0vmwwAAQBs4UafhRXaSlm9P8Ucm4Lx6m85lVZcM9VLUPaCey6Asfa+mccl9MOb+HYKkN7fc9R5kvEwJKRf0ZcYYmeQvF3/fVlA89eg8jKEM/2qgwzeRBo9vJtGb0Q7Q9P08SVaTbjwHEAoUP3RnEA54eYQ8BNGCb1to83ab+POXYlz7n2oJjr+NIYErzvq6PfmH2WjYQGTd5+zROOyMtjyXbY3eO2ey9d7mrEgXapi5HHGK6udXrFm54bMyqNDL50pW+oye2MxkfRgtT+7H7xRbqDVBUQ2hVE2e1+bJpojHZ/rTEoGGhc17V/R+L5omq11rlZ34+lrjGSMDStjJ+0SOEOhSy0DZgAACPr0bPTGWUMDSAIJolQW/Te6UDpgMR+46PtGceFH804wjAuCgev7KrLK/wWSsL6ITLh0528BL1qUuBz/YG5Q6BH7Plq4ff2YiQdFUXjs/4q8p5kwjEhiPVzR0NVTzxt9zbLYOTwyX1N285fL4Xw0WDY9PxobwUToeJDLBb4UPOzpi5pLHaaGqaW6SkpY4AalLRQqA+EMgYm3o7IWoOKfPf0BjKcvSLD88V0xRSJTvqCE+XzoO1RMNW6bVypb+TKFPv1rmc5hVIEfDevrRq6+LB4Pb0NgRlLrkXN13wfwhj+cvN5tN4nntcSFjhX+M9iaFUFShx8qTyG3GG8K7PlZLUGx4RQxz2Q7b/GZI/tn9x6SYgj4o1NyL4RIoBPJ7eZZI76zQzlOATz8sZlfJk8u+CXnzCO3jZ6kPLNrIVK+S4Td/mKNkCc/QH/4H2Qg7lu/2FGC2iKRUg9uxnh3JeyY5naBNKWPzkbOoZTqEkxtrjunbSjlpewe2FSr/V+4RT1o8Eb5r/6tvfRW1AvJhSNR/qE96DWom5+hq13PKy5IOMUnT7JiOBNXfqytecDhbn2zDkwvjgyg9bUm4hwyp0y9yiAwVpURPEdx7WRCbHz0itsArMfgMPyJqGAVau5YVVTOjIX8GwfXaT7cCntJLBjaDD5N4HSO+2/M6IF1QzCXQwLLZUEbKX6zx/ygLJGbEOJ/xbkH+DhoaVn3VSOdgP/YZLG6RJ6pMyGEvQwQ1VjZhwA9HLKJvomcnT0x6NaI/QW6Qhx0Hogs/nEcFoKpprlxZvf5k4QC"
module.exports.hello = async (event) => {
  try {
      const results = await  oneDriveAPI.items.listChildren({
        accessToken,
        itemId: 'root',
        shared: true,
        user: 'fidan'
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: results
        })
      };
    } catch(err) {
      console.log(err)
    }
};

module.exports.hello2 = async (event) => {
  const body = JSON.parse(event.body);
  const {id} = body;
  console.log("EVENTTTTTTTTTTTTT",event)
  try {
    const onRowTrigger = await oneDriveAPI.items.listChildren(
      {
          accessToken,
          itemId: id,
          shared: true,
          user: 'fidi'
        });
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: onRowTrigger
          })
        }
  }
  catch(err) {
    console.log(err)
  }
}

module.exports.hello3 = async (event) => {
   const body = JSON.parse(event.body)
   console.log(body.parentReference.id)
   const { id } = body.parentReference;
   console.log("EVENTTTTTT", event)
     try {
       const onBackTrigger = await oneDriveAPI.items.listChildren(
         {
           accessToken,
           itemId: id || 'root',
           shared: true,
           user: 'fidi'
         }
       );
       return {
         statusCode: 200,
         body: JSON.stringify({
           message: onBackTrigger
         })
       }
     }
     catch(err){
       console.log(err)
     }  
}

module.exports.hello4 = async (event) => {
  console.log(event)
  
  const body = JSON.parse(event.body)
  console.log(typeof body)
  const { id, modify } = body;
    try {
      const onModify = oneDriveAPI.items.update({
        accessToken,
        itemId: id,
        toUpdate: {
              description: modify
            }
      });
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: onModify
        })
      }
    }
    catch(err){
      console.log(err)
    }
}