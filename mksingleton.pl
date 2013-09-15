#!/usr/bin/perl
#
#  This  file  is part of  the digital testament   management program
#                           DigiProof.
#
#  By  accessing  this  software,  DigiProof, you are  duly  informed
#  of and agree to be bound by the conditions described below in this
#  notice:
#
#  This software product,  DigiProof,  is  developed by T. Linden and
#  copyrighted  (C)  2013  by  T. Linden,   with all rights reserved.
#
#  There is no charge for  DigiProof software.  You can  redistribute
#  it  and/or modify  it  under the terms  of the GNU  General Public
#  License, which is incorporated by reference herein.
#
#  DigiProof is distributed WITHOUT ANY WARRANTY, IMPLIED OR EXPRESS,
#  OF MERCHANTABILITY  OR FITNESS  FOR A  PARTICULAR PURPOSE  or that
#  the use of it will not infringe on any third party's  intellectual
#  property rights.
#
#  You should  have received a copy of the GNU General Public License
#  along with DigiProof. Copies can also be obtained from:
#
#    http://www.gnu.org/licenses/gpl-2.0.html
#
#  or by writing to:
#
#    Free Software Foundation, Inc.
#    Inc., 51 Franklin Street, Fifth Floor
#    Boston, MA 02110-1301
#    USA
#
#  Or contact:
#
#    "T. Linden" <tlinden@cpan.org>
#
#  The sourcecode can be found on:
#
#    https://github.com/TLINDEN/digiproof
#

#
#  Used to build digiproof-prod.html and digiproof-dev.html
#  from source files. It just creates a single html file from
#  everything. JS and CSS will bin minified, comments removed,
#  src-file and git hash added.

use Data::Dumper;
use JavaScript::Minifier qw(minify);
use CSS::Compressor qw( css_compress );

my ($type, $index) = @ARGV;

if (!$index) {
  print STDERR "Usage: $0 <prod|dev> <index.html>\n";
  exit 1;
}

my $out = "digiproof-$type.html";

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
    if ($jsfile =~ /digiproof/) {
      $jsfile = "js/digiproof_$type.js";
    }
    print STDERR "Inserting $jsfile\n";
    print qq(<script type="text/javascript">\n);
    print &fetch($jsfile);
    print qq(</script>\n);
  }
  elsif (/GITHASH/) {
    my $hash = &githash($index);
    print "  --   Source: $index, Githash: $hash\n";
  }
  else {
    print qq($_\n);
  }
}




sub fetch {
  my $file = shift;
  open F, "<$file" or die "Could not open index: $file $!\n";
  my $hash = &githash($file);
  if($file =~ /\.js/) {
    my $js;
    my $from = "/* js from $file ($hash) */\n";
    if ($type eq 'prod') {
      $js =  minify(input => *F);
      # ember.js (and probably others) contain strings which contain </script>
      # which leads to rendering failures, those will be fixed here
      $js =~ s/<\/script>/' + Slash + 'script>/g;
      close F;
      return $from . $js;
    }
    else {
      return $from . join '', <F>;
      close F;
    }
  }
  else {
    my $from = "/* css from $file ($hash) */\n";
    my $src = join "", <F>;
    close F;
    if ($prod) {
      return $from . $src;
    }
    else {
      return $from . css_compress($src);
    }
  }
}

sub githash {
  my $file = shift;
  my $hash = `git hash-object $file`;
  chomp $hash;
  return $hash;
}
