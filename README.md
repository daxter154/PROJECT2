Project 2 - Justin Winningham

Submitted - May 7, 4:44

README FILE - CS355

This readme is to document what does and doesnt work on the site, as well as an overview of what it contains.

Over the last 4 days alone, i have spent at least 50 hours working on this project...

As of submission, The only non functional part of the website is the later half of the admin page, specifically, the age update, prefrences update, and rank update, although given more time (haha), they could quickly be implimented.

Consequently, the Apply page, the prefrences dont work, While this project was geared against styling, i found it needed to add at least some CSS, if for no other reason than to show my proficency.

Due to the nature of this project (the fact it can make up for labs), I will now list the portions of how the site satisfied a few that i have missed:

On the apply page, when a user is created, It adds that user the members table and merits table, (merits table takes foreign key reference from members table), username for both is derived from a single input text box.

The Login page uses a low tech user verification form, (you can use "test" username and "test" password to access it). Inserting the admin page inside the login page once verified, normally this could be bypassed by typing in the url directly, but since the res.redirect keeps you on /login, the URL is not avaliable for copying, therefor ensuring a level of security.

On the backend, Views, Controllers, Public (and within public: jscript, images, css) files are neatly organized for easy navigation and ease of access, with app.js being the only file in the root directory without a folder.

However, it is not to say that the website is without fault. Despite the 50+ hours i have spent so far, I was unable to satisfy the required database complexity, nor impliment the view (although i was not far from getting there, as the framework was already in place for it), additionally, while i was able to get the controller and routing working, i was unable to get the models working.

Finally, I hope that you have a great summer, and i really hope i pass this class :P

- Justin Winningham
