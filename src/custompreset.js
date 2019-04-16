import bbobHTML from '@bbob/html';
import { createPreset } from '@bbob/preset';
import presetHTML5 from '@bbob/preset-html5';

const getMapKeyValueByIndex = function( obj, idx ) {
	const key = Object.keys( obj )[ idx ];
	return { key, value: obj[ key ] };
};

export default createPreset( {
	bold: node => ( {
		tag: 'b',
		attrs: node.attrs,
		content: [ {
			tag: 'strong',
			attrs: { class: 'bbcode bbcode_b' },
			content: node.content,
		} ],
	} ),
	italic: node => ( {
		tag: 'i',
		attrs: node.attrs,
		content: [ {
			tag: 'i',
			attrs: { class: 'bbcode bbcode_i' },
			content: node.content,
		} ],
	} ),
	underlined: node => ( {
		tag: 'u',
		attrs: node.attrs,
		content: [ {
			tag: 'u',
			attrs: { class: 'bbcode bbcode_u' },
			content: node.content,
		} ],
	} ),
	striked: node => ( {
		tag: 's',
		attrs: node.attrs,
		content: [ {
			tag: 's',
			attrs: { class: 'bbcode bbcode_s' },
			content: node.content,
		} ],
	} ),

	supscripted: node => ( {
		tag: 'sup',
		attrs: node.attrs,
		content: [ {
			tag: 'sup',
			attrs: { class: 'bbcode bbcode_sup' },
			content: node.content,
		} ],
	} ),
	subscripted: node => ( {
		tag: 'sub',
		attrs: node.attrs,
		content: [ {
			tag: 'sub',
			attrs: { class: 'bbcode bbcode_sub' },
			content: node.content,
		} ],
	} ),

	color: node => ( {
		tag: 'color',
		attrs: node.attrs,
		content: [ {
			tag: 'span',
			attrs: { class: 'bbcode', style: 'color: ' + getMapKeyValueByIndex( node.attrs, 0 ) + ';' },
			content: node.content,
		} ],
	} ),

	spoiler: node => ( {
		tag: 'spoiler',
		attrs: node.attrs,
		content: [ {
			tag: 'div',
			attrs: { class: 'bbcode bbcode_spoiler' },
			content: node.content,
		} ],
	} ),

	h1: node => ( {
		tag: 'h1',
		attrs: node.attrs,
		content: [ {
			tag: 'h1',
			attrs: { class: 'bbcode bbcode_h1' },
			content: node.content,
		} ],
	} ),
	h2: node => ( {
		tag: 'h2',
		attrs: node.attrs,
		content: [ {
			tag: 'h2',
			attrs: { class: 'bbcode bbcode_h2' },
			content: node.content,
		} ],
	} ),
	h3: node => ( {
		tag: 'h3',
		attrs: node.attrs,
		content: [ {
			tag: 'h3',
			attrs: { class: 'bbcode bbcode_h3' },
			content: node.content,
		} ],
	} ),
	h4: node => ( {
		tag: 'h4',
		attrs: node.attrs,
		content: [ {
			tag: 'h4',
			attrs: { class: 'bbcode bbcode_h4' },
			content: node.content,
		} ],
	} ),
	h5: node => ( {
		tag: 'h5',
		attrs: node.attrs,
		content: [ {
			tag: 'h5',
			attrs: { class: 'bbcode bbcode_h5' },
			content: node.content,
		} ],
	} ),

	quote: node => ( {
		tag: 'quote',
		attrs: node.attrs,
		content: [ {
			tag: 'div',
			attrs: { class: 'bbcode bbcode_quote' },
			content: [
				{
					tag: 'span',
					attrs: { class: 'bbcode_quote_name' },
					content: node.attrs,
				},
				node.content
			],
		} ],
	} ),

	left: node => ( {
		tag: 'left',
		attrs: node.attrs,
		content: [ {
			tag: 'div',
			attrs: { class: 'bbcode bbcode_left' },
			content: node.content,
		} ],
	} ),
	center: node => ( {
		tag: 'center',
		attrs: node.attrs,
		content: [ {
			tag: 'div',
			attrs: { class: 'bbcode bbcode_center' },
			content: node.content,
		} ],
	} ),
	right: node => ( {
		tag: 'right',
		attrs: node.attrs,
		content: [ {
			tag: 'div',
			attrs: { class: 'bbcode bbcode_right' },
			content: node.content,
		} ],
	} ),

	url: node => ( {
		tag: 'url',
		attrs: node.attrs,
		content: [ {
			tag: 'a',
			attrs: { class: 'auto_link named_url', href: node.attrs },
			content: node.content,
		} ],
	} ),

	/*
	youtube: node => ( {
		tag: 'yt',
		attrs: node.attrs,
		content: [ {
			tag: 'yt',
			attrs: { },
			content: node.content,
		} ],
	} ),
	*/
} );
