function calculateSplitTotalFromRate(total, rate, split) {
	let rate_as_decimal_fraction = quotient(rate);
	let total_including_tip = product(total, sum(1, rate_as_decimal_fraction));
	let split_amount = quotient(total_including_tip, split);

	return format(split_amount);
}

function calculateSplitTotalFromAmount(total, tip, split) {
	let is_total_zero = Number(total) === 0;
	if (is_total_zero) return format(total);

	let total_including_tip = sum(total, tip);
	let split_amount = quotient(total_including_tip, split);

	return format(split_amount);
}

function calculateTipAmountFromRate(total, rate) {
	let rate_as_decimal_fraction = quotient(rate);
	let tip_amount = product(total, rate_as_decimal_fraction);

	return format(tip_amount);
}

function calculateTipAmountFromAmount(amount) {
	return format(amount);
}

function calculateFinalTotal(total, tip) {
	let is_total_zero = Number(total) === 0;
	if (is_total_zero) return format(total);

	let final_total = sum(total, tip);

	return format(final_total);
}

function sum(a, b) {
	return Number(a) + Number(b);
}
function product(a, b) {
	return Number(a) * Number(b);
}

function quotient(a, b = 100) {
	let is_denominator_zero = Number(b) === 0;

	if (is_denominator_zero) return undefined;

	return Number(a) / Number(b);
}

function format(value, decimalPoint = 2) {
	return Number(value).toFixed(decimalPoint);
}

export const UTILITIES = {
	CALCULATE: {
		SPLIT_TOTAL: {
			RATE: calculateSplitTotalFromRate,
			AMOUNT: calculateSplitTotalFromAmount,
		},
		TIP_AMOUNT: {
			RATE: calculateTipAmountFromRate,
			AMOUNT: calculateTipAmountFromAmount,
		},
		FINAL_TOTAL: calculateFinalTotal,
	},
};
