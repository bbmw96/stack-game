#!/usr/bin/perl
# Perl utility - text helpers
use strict;
use warnings;

sub trim {
    my ($s) = @_;
    $s =~ s/^\s+|\s+$//g;
    return $s;
}

sub title_case {
    my ($s) = @_;
    return join(' ', map { ucfirst(lc($_)) } split(/\s+/, $s));
}

print title_case("hello world from perl"), "\n";
