package utils;

public class ISBNHelper {
    public static boolean isValid(String isbnDigits) {
        // length must be 13 or 10
        int n = isbnDigits.length();

        if (n == 13){
            return is13DigitISBN(isbnDigits);
        } else if (n == 10) {
            return is10DigitISBN(isbnDigits);
        } else {
            return false;
        }
    }
    public static boolean is13DigitISBN(String isbn){
        int sum = 0;
        for (int i = 0; i < 12; i++){
            int digit = isbn.charAt(i) - '0';
            if (i % 2 != 0) {
                digit *= 3;
            }
            sum += digit;
        }
        int r = 10 - (sum % 10);
        int thirteenth = isbn.charAt(12) - '0';

        if (r < 10){
            return thirteenth == r;
        } else if (r == 10){
            return thirteenth == 0;
        }
        return false;
    }
    public static boolean is10DigitISBN(String isbn){
        // Computing weighted sum of first 9 digits
        int sum = 0;
        for (int i = 0; i < 9; i++) {
            int digit = isbn.charAt(i) - '0';
            if (0 > digit || 9 < digit)
                return false;
            sum += (digit * (10 - i));
        }

        // Checking last digit and adding it to the sum
        char last = isbn.charAt(9);
        if (last != 'X' && (last < '0' || last > '9'))
            return false;

        sum += ((last == 'X') ? 10 : (last - '0'));

        // Return true if weighted sum of digits is divisible by 11
        return (sum % 11 == 0);
    }
}
