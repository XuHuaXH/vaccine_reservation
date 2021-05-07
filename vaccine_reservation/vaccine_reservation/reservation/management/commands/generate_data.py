from django.core.management.base import BaseCommand, CommandError
from reservation.models import *
from reservation.generate_data import *


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        # parser.add_argument('poll_ids', nargs='+', type=int)
        pass

    def handle(self, *args, **options):
        generate_patients(300)
        generate_providers(20)
        self.stdout.write(self.style.SUCCESS('Successfully generated some data!'))
