<?php
/**
 * The homepage: standfirst + the full index of letters.
 */
get_header();
?>
		<p class="standfirst"><?php echo esc_html( unpublishable_standfirst() ); ?></p>
		<section class="list">
<?php
if ( have_posts() ) {
	while ( have_posts() ) {
		the_post();
		get_template_part( 'inc/letter-item' );
	}
}
?>
		</section>
<?php
get_footer();
