#!/usr/bin/perl
use Data::Dumper;
use JavaScript::Minifier qw(minify);
use CSS::Compressor qw( css_compress );

my $index = shift;

if (!$index) {
  print STDERR "Usage: $0 <index.html>\n";
  exit 1;
}

my $out = "digiproof.html";

print STDERR "open index\n";
open I, "<$index" or die "Could not open index: $index $!\n";
my @source = <I>;
close I;

print STDERR "open $out\n";
open OUT, ">$out" or die "Could not open output $out: $!\n";
select OUT;

print STDERR "enter loop\n";
foreach (@source) {
  chomp;
  next if(/^\s*$/);
  if (/rel="stylesheet" href="([^"]*)"/) {
    my $cssfile = $1;
    my $media = "";
    if (/media="([^"]*)"/) {
      $media = qq( media="$1" );
    }
    print STDERR "Inserting $cssfile\n";
    print qq(<style type="text/css" $media>\n);
    print &fetch($cssfile);
    print qq(</style>\n);
  }
  elsif (/script src="([^"]*)"/) {
    my $jsfile = $1;
    print STDERR "Inserting $jsfile\n";
    print qq(<script type="text/javascript">\n);
    print &fetch($jsfile);
    print qq(</script>\n);
  }
  else {
    print qq($_\n);
  }
}




sub fetch {
  my $file = shift;
  open F, "<$file" or die "Could not open index: $file $!\n";
  if($file =~ /\.js/) {
    my $js =  minify(input => *F);
    # ember.js (and probably others) contain strings which contain </script>
    # which leads to rendering failures, those will be fixed here
    $js =~ s/<\/script>/' + Slash + 'script>/g;
    close F;
    return "/* js from $file */\n" . $js;
  }
  else {
    my $src = join "", <F>;
    close F;
    return  "/* css from $file */\n" . css_compress($src);
  }
}
