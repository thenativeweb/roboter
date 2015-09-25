# Developers' notes

The dependency to `gulp` is a little bit complicated: When running the globally installed roboter, it delegates work to the locally installed gulp, which in turn loads the locally installed roboter - which again uses the locally installed gulp.

So we have:

```
global roboter => local gulp => local roboter => local gulp
```

Now, this works when the local gulp is the same instance in both cases, i.e. if we have the following folder structure in the target module:

```
/node_modules
  /gulp
  /roboter
```

It does *not* work if we have this structure instead:

```
/node_modules
  /gulp
  /roboter
    /node_modules
      /gulp
```

Now which file structure you get depends on how you run npm. If you run

```bash
$ npm install roboter gulp
```

then everything is fine. If you instead run

```bash
$ npm install roboter
$ npm install gulp
```

you end up with the non-working option, because now we have two gulp installations that don't know each other.

This is very hard to track down: Everything will work, except that gulp claims to not have found any tasks in the gulp file. Of course, you might try to detect this programmatically, but it still feels very fragile.

So in the end we decided to remove gulp as a direct dependency from roboter, so this situation can not happen.

Just that you know :-).
